const getUsers = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/list-users');
        return response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const createUsers = async (requestUser) => {
    try {
        const response = await fetch('http://localhost:5000/api/create-user',{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestUser)
          });
        return response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const editUsers = async (requestUser) => {
    try {
        const response = await fetch('http://localhost:5000/api/update-user',{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestUser)
          });
        return response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const deleteUsers = async (numberDoc) => {
    try {
        const response = await fetch(`http://localhost:5000/api/delete-user/${numberDoc}`,{
            method: 'POST'
          });
        return response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

export { getUsers, createUsers, editUsers, deleteUsers };