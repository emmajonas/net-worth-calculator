export async function getNewTotals(data) {
    try {
        const response = await fetch("/", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error("Error while fetching data");
        }
        return await response.json();
    } catch(error) {
        return error;
    }
}
