export function getUserDetails() {
    try {
        const userData = localStorage.getItem("ToDoAppUser");
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
    }
}
