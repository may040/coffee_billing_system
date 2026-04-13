import React, { useEffect, useState } from "react";
import { BLUE_BUTTON_CSS, createMailtoLinkForCSV, RED_BUTTON_CSS, SPECIFIC_USER_MANAGEMENT_PATH, toEuro } from "../util/VisualUtil";
import { Link } from "react-router-dom";
import { downloadCSV, generateCSV } from "../util/InvoiceGenerationUtil";
import { deleteUser, getUserDebts } from "../rest_api/UserAPI";
import { createSingleUserInvoice } from "../rest_api/PurchaseAPI";
import { getAccountant } from "../rest_api/ConfigAPI";

/**
 * Management user table component that displays users, their depts and provides
 * invoice creation and user management functionality
 * 
 * @author Mathias Wetzer
 * @param {Object} props - The component props
 * @param {User[]} props.users - List of all users that shall be displayed 
 * @returns {JSX.Element} The rendered ManagementUserTable table 
 */
const ManagementUserTable = ({ users }) => {
    const [userDebts, setUserDebts] = useState({});
    const [downloading, setDownloading] = useState(false);

    /**
     * Prepare array of user Depts  
     */
    useEffect(() => {
        console.log("USERSSSSSSS")
        const fetchData = async () => {
            const debts = {};
            for (const user of users) {
                try {
                    const debt = await getUserDebts(user.getAbbrevation());
                    debts[user.getAbbrevation()] = debt;
                } catch (error) {
                    console.error(error);
                }
            }
            setUserDebts(debts);
        }

        fetchData();
    }, [users])

    if (!userDebts) {
        return <div>Loading...</div>
    }
    
    /**
     * Handles the "Create Invoice" click Event.
     * Creates a .csv file and downloads it to the users computer
     * 
     * @param {Event} event 
     */
    const startDownload = async (event) => {
        const abbr = event.currentTarget.getAttribute('data-abbr');

        const conf = window.confirm(`You are about to create a new Invoice for user with abbreviation "${abbr}" and download it. Are you sure you want to proceed?`);
        if (!conf) {
            return;
        }

        setDownloading(true);

        try {
            const accountant = await getAccountant();
            const invoice = await createSingleUserInvoice(abbr);
            const u = invoice.getUsers();
            const debts = invoice.getDepts();

            const headers = ["Surname", "Name", "Abbreviation", "Debts"];
            const rows = [[u[0].getSurname(), u[0].getName(), u[0].getAbbrevation(), toEuro(debts[0]), createMailtoLinkForCSV(accountant, debts[0])]];
        
            const csvFile = generateCSV(headers, rows);
            downloadCSV(csvFile, `InvoiceFor${u[0].getSurname()}${u[0].getName()}`)
            window.location.reload();    
        } catch (error) {
            console.error(error);
        } finally {
            setDownloading(false);          
        }
    }

    /**
     * Handles the "Delete" click Event
     * Send information about which user to delete to the server via the deleteUser() RestAPI call
     * 
     * @param {Event} event 
     */
    const delUser = (event) => {
        const abbreviation = event.currentTarget.getAttribute('data-abbr');

        const conf = window.confirm(`You are about to delete the user with abbreviation "${abbreviation}". Are you sure you want to proceed?`);
        if (!conf) {
            return;
        }

        deleteUser(abbreviation).then(
            status => {
                if (status) {
                    window.location.reload();
                } else {
                    alert("Deleting user failed. Server response was not ok!");
                }
            }
        )
    }

    return(
        <div className="container mx-auto p-4">
            <table className="min-w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2 w-[300px] text-left">Users</th>
                        <th className="px-4 py-2 w-[150px] text-left">Debts</th>
                        <th className="px-4 py-2 w-[160px]"></th>
                        <th className="px-4 py-2 w-[120px]"></th>
                        <th className="px-4 py-2 w-[130px]"></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.getID()} className="border-b">
                            <td className="px-4 py-2">{user.getSurname()} {user.getName()} ({user.getNickname()})</td>
                            <td className="px-4 py-2">
                                {userDebts[user.getAbbrevation()] !== undefined
                                    ? toEuro(userDebts[user.getAbbrevation()])
                                    : 'Loading...'}         
                            </td>
                            <td>
                                <button className={`${BLUE_BUTTON_CSS}`} onClick={startDownload} data-abbr={user.getAbbrevation()}>Create Invoice</button>
                            </td>
                            <td>
                                <Link to={`${SPECIFIC_USER_MANAGEMENT_PATH}?id=${user.getID()}&abbr=${user.getAbbrevation()}`} className={`${BLUE_BUTTON_CSS}`}>
                                    Edit
                                </Link>
                            </td>
                            <td>
                                <button className={`${RED_BUTTON_CSS}`} data-abbr={user.getAbbrevation()} onClick={delUser}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ManagementUserTable;