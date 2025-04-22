

export function fetchUserorder(id) {
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : null; // Extract token from user object
  return new Promise(async (resolve) => {
    const response = await fetch(`https://sagar-e.onrender.com/order/` + id, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        
        'content-type': 'application/json' },
    });
    const data = await response.json();
    resolve({ data });
  });
}



  export function fetchLoggedInUser(id) {
    return new Promise(async (resolve, reject) => {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null; // Extract token from user object
      try {
        const response = await fetch(`https://sagar-e.onrender.com/users/` + id , {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            
            'content-type': 'application/json' },
          
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        resolve({ data });
      } catch (error) {
        reject({ error: error.message });
      }
    });
  }
  
  
  export function updateUser(update) {
    return new Promise(async (resolve) => {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null; // Extract token from user object
      const response = await fetch(`https://sagar-e.onrender.com/users/${update.id}`,{
        method: 'PATCH',
        body: JSON.stringify(update),
        headers: {
          'Authorization': `Bearer ${token}`,
          
          'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    });
  }