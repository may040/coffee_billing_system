import React, { useEffect, useState } from "react";
import { getOverallLeaderboard } from "../../rest_api/StatisticsAPI";

const OverallLeaderboard = () => {
    const [table, setTable] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tableData = await getOverallLeaderboard();
                setTable(tableData);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [])
    
    if (!table) {
        return <div>Loading ...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <table className="min-w-full border-collapse">
                <thead>
                    <tr className="border-b border-gray-500">
                        {table.getHeaders().map(header => (
                            <th className="px-4 py-2 w-[300px] font-bold">{header}</th>
                        ))}
                    </tr>
                    </thead>
                <tbody>
                    {table.getRows().map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-300">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="text-center px-4 py-2 w-[300px]">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OverallLeaderboard;