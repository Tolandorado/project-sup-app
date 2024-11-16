import { Task, useGetTasksQuery } from '@/src/state/api';
import TaskCard from "@/src/app/components/TaskCard";
import React from 'react'
import Header from '../../components/Header';

type ListProps = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void;
}

const ListView = ({id, setIsModalNewTaskOpen}: ListProps) => {
    const { data: tasks, error, isLoading } = useGetTasksQuery({ projectId: Number(id) });
    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Task list loading error...</div>    
  return (
    <div className='px-4 pb-8 xl:px-6'>
        <div className='pt-5'>
            <Header name="List"/>
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>
            {tasks?.map((task: Task) => <TaskCard key={task.id} task={task} />)}
        </div>    
    </div>
  )
}

export default ListView