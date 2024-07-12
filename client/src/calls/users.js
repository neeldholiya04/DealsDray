const {axiosInstance} = require('./index')



export const LoginUser = async (value) =>{
    try {
        const response = await axiosInstance.post("api/users/login", value);
        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const addUser = async (value) =>{
    try {
        const response = await axiosInstance.post("api/users/register", value);
        return response.data
    } catch (error) {
        console.log(error);
    }
}



export const getAllEmployees = async () => {
    try {
      const response = await axiosInstance.get('/api/users/employees');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  };

  export const deleteEmployee = async (employeeId) => {
    try {
      const response = await axiosInstance.delete(`/api/users/employees/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting employee ${employeeId}:`, error);
      throw error;
    }
  };


  export const updateEmployee = async (employeeId, updatedEmployee) => {
    try {
      const response = await axiosInstance.put(`/api/users/employee/${employeeId}`, updatedEmployee);
      return response.data;
    } catch (error) {
      console.error(`Error updating employee ${employeeId}:`, error);
      throw error;
    }
  };
