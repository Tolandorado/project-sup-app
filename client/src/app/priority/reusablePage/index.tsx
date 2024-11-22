"use client";

import { Priority, Task, useGetTasksByUserQuery } from '@/src/state/api'
import React, { use, useState } from 'react'
import { useAppSelector } from '../../redux'
import ModalNewTask from '@/src/components/ModalNewTask'
import Header from '@/src/components/Header'
import TaskCard from '@/src/components/TaskCard';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { dataGridClassNames, dataGridSxStyles } from '@/src/lib/utils';

type Props = {
    priority: Priority
};

const columns: GridColDef[] = [
    {
        field: "title",
        headerName: "Title",
        width: 100,
    },
    {
        field: "description",
        headerName: "Description",
        width: 200,
    },
    {
        field: "status",
        headerName: "Status",
        width: 130,
        renderCell: (params) => (
            <span className='inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800'>
                {params.value}
            </span>
        ),   
    },
    {
        field: "priority",
        headerName: "Priority",
        width: 75,
    },
    {
        field: "tags",
        headerName: "Tags",
        width: 120,
    },
    {
        field: "startDate",
        headerName: "Start Date",
        width: 100,
    },
    {
        field: "dueDate",
        headerName: "Due Date",
        width: 100,
    },
    {
        field: "author",
        headerName: "Author",
        width: 150,
        renderCell: (params) => params.row.author.username || "Unknown",
    },
    {
        field: "assignee",
        headerName: "Assignee",
        width: 150,
        renderCell: (params) => params.row.assignee.username || "Unassigned",
    },
]

const ReusablePage = ({priority}: Props) => {
    const [ view, setView ] = useState("list");
    const [ isModalNewTaskOpen, setIsModalNewTaskOpen ] = useState(false);

    const userId = 1;
    const {data: tasks, isLoading, isError: isTasksError} = useGetTasksByUserQuery(userId || 0, {
        skip: userId === null
    });

    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const filteredTasks = tasks?.filter((task: Task) => task.priority === priority)

    if (isTasksError || !tasks) return <div>Error fetching tasks</div>;

  return (
    <div className='m-5 p-4'>
        <ModalNewTask 
        isOpen={isModalNewTaskOpen} 
        onClose={() => setIsModalNewTaskOpen(false)}
        />
        <Header name="Priority Page" buttonComponent={
            <button className='mr-3 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
            onClick={() => setIsModalNewTaskOpen(true)}>
            New Task
            </button>
        }/>
        <div className='mb-4 flex justify-start'>
            <button 
            className={`px-4 py-2 rounded-l dark:bg-dark-tertiary ${
                view === "list" ? "bg-gray-300 dark:bg-gray-300" : "bg-white"
            }`}
            onClick={() => setView("list")}>
                List
            </button>
            <button 
            className={`px-4 py-2 rounded-r dark:bg-dark-tertiary ${
                view === "table" ? "bg-gray-300 dark:bg-gray-300" : "bg-white"
            }`}
            onClick={() => setView("table")}>
                Table
            </button>
        </div>
        {isLoading ? (<div>Loading tasks...</div>) : view === "list" ? (
            <div className='grid grid-cols-1 gap-4'>
                {filteredTasks?.map((task:Task) => (
                    <TaskCard key={task.id} task={task} />
                ))}
            </div>
        ) : (
            view === "table" && filteredTasks && (
                <div className='z-0 w-full'>
                    <DataGrid
                    rows={filteredTasks}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row) => row.id}
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                    />
                </div>
            )
        )}
    </div>
  );
};

export default ReusablePage;