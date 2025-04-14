

export function createUser(userData) {
    return new Promise(async (resolve) => {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
          'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    });
  }

export function checkUser (logininfo) {
    return new Promise(async (resolve , reject) => {
        // const email = logininfo.email;
        // const password = logininfo.password
        const token = localStorage.getItem('token')
        try{
          const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            body: JSON.stringify(logininfo),
            headers: {
             'Authorization': `Bearer ${token}`,
              
              'content-type': 'application/json' },
            })
            if(response.ok){
              const data = await response.json()
              resolve({data})
            }
            else{
              const data = await response.json()
              reject({data})
            }
    
        }
        catch(err){
          reject({err})
        }
  
    
    });
}

export function loginUser(loginInfo) {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          body: JSON.stringify(loginInfo),
          headers: {
          'Authorization': `Bearer ${token}`,
            
            'content-type': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          resolve({ data });
        } else {
          const error = await response.text();
          reject(error);
        }
      } catch (error) {
        reject( error );
      }
  
    });
  }


  export function updateuser(update) {
    return new Promise(async (resolve) => {
      const token = localStorage.getItem('token')
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


  export function signout(userId) {
    return new Promise(async (resolve, reject) => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('/auth/logout', {
          headers:{
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json' }
        });
        if (response.ok) {
          resolve({ data:'success' });
        } else {
          const error = await response.text();
          reject(error);
        }
      } catch (error) {
        console.log(error)
        reject( error );
      }
    });
  }