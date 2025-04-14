

export function fetchUserorder(id) {
  const token = localStorage.getItem('token');
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/order/' + id, {
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
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:8080/users/' + id , {
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/users/${update.id}`,{
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