import {X} from "lucide-react";
import React, {useState} from "react";


interface ChatsProps{
    onClick:() => void;
    isOpen: boolean;
}
type Friend = {
    id: number
    name: string
    avatar: string
}

type Group = {
    id: number
    name: string
}

const friends: Friend[] = [
    { id: 1, name: "Alice", avatar: "/images/avatar.jpg" },
    { id: 2, name: "Bob", avatar: "/images/avatar.jpg" },
    { id: 3, name: "Charlie", avatar: "/images/avatar.jpg" },
]

const groups: Group[] = [
    { id: 1, name: "Family" },
    { id: 2, name: "Work" },
    { id: 3, name: "Friends" },

]



const Chats: React.FC<ChatsProps> = (props : ChatsProps) => {
    const [activeChat, setActiveChat] = useState<number | null>(null)
    return (
        <div
            className={`
                        absolute  right-0 h-[calc(100%-5rem)] w-64 bg-white shadow-lg 
                        transform transition-all duration-300 ease-in-out origin-right rounded-lg
                        ${props.isOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
                    `}
        >

            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Friends & Groups</h2>
                    <button onClick={props.onClick} className="focus:outline-none">
                        <X className="h-6 w-6"/>
                    </button>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <h3 className="font-semibold mb-2">Friends</h3>
                    {friends.map((friend) => (
                        <div key={friend.id} className="mb-2">
                            <div
                                className="flex items-center space-x-4 cursor-pointer"
                                onClick={() => setActiveChat(activeChat === friend.id ? null : friend.id)}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover"/>
                                </div>
                                <div>{friend.name}</div>
                            </div>

                        </div>
                    ))}
                    <h3 className="font-semibold mt-4 mb-2">Groups</h3>
                    {groups.map((group) => (
                        <div key={group.id} className="flex items-center space-x-4 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {group.name[0]}
                            </div>
                            <div>{group.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


export default Chats;