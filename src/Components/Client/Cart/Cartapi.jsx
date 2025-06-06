
export function addToCart(item) {
    return new Promise(async (resolve) => {
      const user = localStorage.getItem('user');
      const token = user ? JSON.parse(user).token : null; // Extract token from user object
      const response = await fetch('https://sagar-e.onrender.com/cart', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json' },
      });
      const data = await response.json();
      resolve({ data });
    });
  }

  export function fetchItemsById(id) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = localStorage.getItem('user');
          const token = user ? JSON.parse(user).token : null; // Extract token from user object
          const response = await fetch(`https://sagar-e.onrender.com/cart?user=${id}`, {
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
          console.log('Error fetching product by ID:', error);
          reject(error);
        }
      });
    }

    export function updateCart(update) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = localStorage.getItem('user');
          const token = user ? JSON.parse(user).token : null; // Extract token from user object
          const response = await fetch(`https://sagar-e.onrender.com/cart/` + update.id, {
            method: 'PATCH',
            body: JSON.stringify(update),
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const responseText = await response.json();
          if (response.ok) {
            resolve({ data: responseText });
          } else {
            reject(new Error('Failed to update cart'));
          }
        } catch (error) {
          console.error('Error while updating cart:', error);
          reject(error);
        }
      });
    }
    
      export function deleteCart(itemId) {
        return new Promise(async (resolve) => {
          const user = localStorage.getItem('user');
          const token = user ? JSON.parse(user).token : null; // Extract token from user object
          const response = await fetch(`https://sagar-e.onrender.com/cart/${itemId}`, {
            method: 'DELETE',
            headers: { 
          'Authorization': `Bearer ${token}`,
              'content-type': 'application/json' },
          });
          const data = await response.json();
          resolve( {data});
        });
      }

      export function resetCart() {
        // get all items of user's cart - and then delete each
        return new Promise(async (resolve) => {
          const response = await fetchItemsById();
          const items = response.data;
          for (let item of items) {
            await deleteCart(item.id);
          }
          resolve({ status: 'success' });
        });
      }