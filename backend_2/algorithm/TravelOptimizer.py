import json
import random

import googlemaps
from datetime import datetime, timedelta
import networkx as nx


class TravelOptimizer:

    def __init__(self):
        self.gmaps = googlemaps.Client(key='AIzaSyAv3elRzdFgKZ4m0Vak5X0ecYSvejjLdTU')

        self.data = None
        self.G = None
        self.time_weight = 0.5
        self.same_end_location = True
        self.traveling_mode = 'driving'
        self.aco = None
        self.is_multi_region = False
        self.is_multi_user = False
        self.users = []
        self.n_days = None
        self.days_in_region = None
        self.final_trip = {}

        self.current_trip_time = None

    def optimize_travel(self):

        regions = self.parse_data()

        self.create_graph(regions)
        self.aco = AntColonyAlgorithm(self.G, time_weight=self.time_weight)
        routes = self.aco.optimize()
        self.select_best_correct_route(routes)

        if self.is_multi_region:
            for region, next_region in zip(regions, regions[1:] + [regions[0]]):
                region_routes, names_mapping = self.optimize_region(region)
                self.update_final_trip(region, next_region, region_routes, names_mapping)

        return self.final_trip

    def parse_data(self):

        self.final_trip['id'] = self.data['id']
        self.final_trip['name'] = self.data['name']
        self.final_trip['description'] = self.data['description']
        self.final_trip["start_date"] = self.data["start_date"]
        self.final_trip["end_date"] = self.data["end_date"]
        self.final_trip["step_groups"] = []

        self.n_days = datetime.strptime(self.final_trip['end_date'], "%Y-%m-%d") - datetime.strptime(
            self.final_trip['start_date'], "%Y-%m-%d")

        self.current_trip_time = datetime.strptime(self.final_trip['start_date'], "%Y-%m-%d")
        regions = list(set([group['region'] for group in self.data['step_groups']]))

        if len(regions) > 1:
            self.is_multi_region = True
        else:
            steps = []
            for group in self.data['step_groups']:
                [steps.append(self.extract_region(step)) for step in group['steps']]
            regions = list(set(steps))

            if len(regions) > 1:
                self.is_multi_region = True
            else:
                self.is_multi_region = False

        users = [user for user in self.data['members']]
        if len(users) > 1:
            self.is_multi_user = True

        self.days_in_region = self.n_days / len(regions)

        return regions

    def extract_region(self, step):

        return ','.join(step['start_location'].split(',')[-2:])

    def create_graph(self, steps, constraints=None, mode='driving'):

        distance_matrix = self.gmaps.distance_matrix(origins=steps,
                                                     destinations=steps,
                                                     mode=mode)
        self.G = nx.DiGraph()

        origins = distance_matrix['origin_addresses']
        destinations = distance_matrix['destination_addresses']
        rows = distance_matrix['rows']
        distance = fare = time = None

        for i, origin in enumerate(origins):
            for j, destination in enumerate(destinations):
                if rows[i]['elements'][j]['status'] == 'OK':
                    distance = rows[i]['elements'][j]['distance']['value']
                    time = rows[i]['elements'][j]['duration']['value']
                    if 'fare' in rows[i]['elements'][j].keys():
                        fare = rows[i]['elements'][j]['fare']['value']

                if distance and distance > 0:
                    if fare:
                        self.G.add_edge(origin, destination, cost=fare, time=time, pheromone=0.5,
                                        proximity=1000 / (time * self.time_weight + fare * (1 - self.time_weight)))
                    else:
                        self.G.add_edge(origin, destination, cost=distance, time=time, pheromone=0.5,
                                        proximity=1000 / (time * self.time_weight + distance * (1 - self.time_weight)))

                distance = time = fare = None

        return origins

    def select_best_correct_route(self, routes):
        # TODO
        return routes[0][2]

    def optimize_region(self, region):
        steps = []
        if len(self.data.get("step_groups")) == 1 and self.is_multi_region:
            group = self.data.get("step_groups")[0]
            [steps.append(step['start_location']) for step in group.get("steps", []) if
             region in step['start_location']]

        else:
            for group in self.data.get("step_groups"):
                if group.get("region") == region:
                    [steps.append(step['start_location']) for step in group.get("steps", [])]

        names = self.create_graph(steps)

        names_mapping = dict(zip(names, steps))

        self.aco = AntColonyAlgorithm(self.G, time_weight=self.time_weight)
        routes = self.aco.optimize()

        return routes, names_mapping

    def update_final_trip(self, region, next_region, routes, names_mapping):
        route = routes[0][2]

        group = None
        new_region = {}
        if len(self.data.get("step_groups")) == 1 and self.is_multi_region:
            group = self.data.get("step_groups")[0]

            new_region['id'] = random.randint(1000, 10000)
            new_region['region'] = region
            new_region['trip'] = group['trip']
            new_region['steps'] = []

        else:
            for old in self.data.get("step_groups", []):
                if old.get("region") == region:
                    group = old
                    break
            new_region['id'] = group['id']
            new_region['region'] = group['region']
            new_region['trip'] = group['trip']
            new_region['steps'] = []

        for step_name in route:
            for step in group['steps']:
                if step['start_location'] == names_mapping[step_name]:
                    new_step = step.copy()
                    new_step['start'] = self.current_trip_time.strftime('%Y-%m-%d %H:%M:%S')
                    new_step['end'] = (self.current_trip_time + timedelta(hours=2)).strftime('%Y-%m-%d %H:%M:%S')
                    self.current_trip_time = self.current_trip_time + timedelta(hours=3)
            new_region['steps'].append(new_step)

        distance = self.gmaps.distance_matrix(region,
                                              next_region,
                                              mode=self.traveling_mode)['rows'][0]['elements'][0]

        new_region['steps'].append({
            "id": None,
            "type": "travel",
            "name": "Traveling",
            "start": self.current_trip_time.strftime('%Y-%m-%d %H:%M:%S'),
            "end": (self.current_trip_time + timedelta(seconds=distance['duration']['value'])).strftime(
                '%Y-%m-%d %H:%M:%S'),
            "start_location": region,
            "end_location": next_region,
            "cost": None,
            "currency": None,
            "distance": distance['distance']['value'],
            "notes": "",
            "attachment": "",
            "step_group": new_region['id'],
        })

        self.current_trip_time = self.current_trip_time + timedelta(days=1)
        self.current_trip_time = self.current_trip_time.replace(hour=10, minute=0, second=0, microsecond=0)

        self.final_trip['step_groups'].append(new_region)


class AntColonyAlgorithm:
    def __init__(self, G, alfa=1, beta=1,
                 max_iterations=100, n_ants=10,
                 evaporation_rate=0.95, init_pheromone_level=0.5, Q=1000, time_weight=0.5):
        self.G = G
        self.ants = []
        self.alfa = alfa
        self.beta = beta
        self.max_iterations = max_iterations
        self.n_ants = n_ants
        self.evaporation_rate = evaporation_rate
        self.init_pheromone_level = init_pheromone_level
        self.Q = Q
        self.time_weight = time_weight
        self.frontier = []

    def optimize(self):
        self.initialize_ants()
        for generation in range(self.max_iterations):
            for ant in self.ants:
                cost, time, is_valid, path = ant.traverse_graph()
                if is_valid:
                    self.update_best_routes((cost, time, path))

            self.update_pheromones()
            self.reset_ants()

        return self.frontier

    def update_pheromones(self):

        for u, v, data in self.G.edges(data=True):
            data['pheromone'] *= self.evaporation_rate

        for ant in self.ants:
            ant.update_pheromones()

    def update_best_routes(self, new_solution):

        cost, time, path = new_solution
        for solution in self.frontier:
            solution_cost, solution_time, _ = solution

            if solution_cost <= cost and solution_time <= time:
                return

            if solution_cost > cost and solution_time > time:
                self.frontier.remove(solution)

        self.frontier.append(new_solution)

    def reset_ants(self):
        for ant in self.ants:
            ant.reset()

    def initialize_ants(self):
        for _ in range(self.n_ants):
            self.ants.append(Ant(G=self.G, alfa=self.alfa, beta=self.beta, Q=self.Q))


class Ant:
    def __init__(self, G, alfa, beta, Q, time_weight=0.5, same_start_end_location=True):
        self.G = G

        self.alfa = alfa
        self.beta = beta
        self.Q = Q

        self.time_weight = time_weight
        self.cost = 0
        self.time = 0
        self.same_start_end_location = same_start_end_location

        self.current = None
        self.is_valid = True
        self.visited = []

    def traverse_graph(self):

        start_point = random.choice(list(self.G.nodes))
        self.current = start_point
        self.visited.append(start_point)

        for _ in range(len(self.G.nodes) - 1):
            self.make_step()
        if self.same_start_end_location:
            self.cost += self.G[self.current][start_point]['cost']
            self.time += self.G[self.current][start_point]['time']

        return self.cost, self.time, self.is_valid, self.visited

    def update_pheromones(self):

        for u, v in zip(self.visited[:-1], self.visited[1:]):
            self.G[u][v]['pheromone'] += self.Q / (self.cost * (1 - self.time_weight) + self.time * self.time_weight)

    def make_step(self):

        neighbors = self.G.neighbors(self.current)

        neighbors = [neighbor for neighbor in neighbors if neighbor not in self.visited]

        neighbors_desires = [
            self.G[self.current][neighbor]['pheromone'] * self.alfa + self.G[self.current][neighbor][
                'proximity'] * self.alfa
            for neighbor in neighbors]

        neighbors_probability = [desire / sum(neighbors_desires) for desire in neighbors_desires]

        next_node = random.choices(neighbors, weights=neighbors_probability, k=1)[0]

        self.cost = self.G[self.current][next_node]['cost']
        self.time = self.G[self.current][next_node]['time']

        self.visited.append(next_node)

        self.current = next_node

    def reset(self):
        self.cost = 0
        self.time = 0

        self.current = None
        self.is_valid = True
        self.visited = []


