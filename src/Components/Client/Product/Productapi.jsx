
export function fetchproductsbycategory() {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/category', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  // optional, depending on your API
        },
      });

      if (!response.ok) {
        // Handle error (e.g., unauthorized, server issues)
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      resolve({ data });


    } catch (error) {
      reject(error);

    }
  });
}

export function fetchproductsbybrand() {
  return new Promise(async (resolve) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/brands', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',  // optional, depending on your API
      },
    })
    const data = await response.json()
    resolve({ data })
  });
}

export function fetchproductsById(id) {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/product/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  // optional, depending on your API
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      resolve({ data });
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      reject(error);
    }
  });
}

export function fetchproductbyfilter(filter = {}, sort = {}) {
  let queryString = '';

  // 🧠 CHOOSE ONE: Either comma-separated (A) or repeated params (B)
  const useCommaSeparated = true; // <-- toggle this to false if your API expects repeated query params

  // Build query string from filter
  for (let key in filter) {
    const values = filter[key];
    if (Array.isArray(values) && values.length > 0) {
      if (useCommaSeparated) {
        // (A) Comma-separated
        queryString += `${key}=${values.join(',')}&`;
      } else {
        // (B) Repeated keys
        values.forEach(value => {
          queryString += `${key}=${value}&`;
        });
      }
    } else if (typeof values === 'string' || typeof values === 'number') {
      queryString += `${key}=${values}&`;
    }
  }

  // Add sorting params
  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }

  // Clean up trailing &
  queryString = queryString.replace(/&$/, '');

  // ✅ Final URL
  const url = `http://localhost:8080/product?${queryString}`;

  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.statusText}`);
      }

      const data = await response.json();
      const totalItems = +response.headers.get('X-Total-Count') || data.length;

      resolve({
        data: {
          products: data,
          totalItems,
        },
      });
    } catch (error) {
      reject(error);
    }
  });
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/product', {
      method: 'POST',
      body: JSON.stringify(product),
      'Authorization': `Bearer ${token}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json'
      },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:8080/product/${update.id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(update),
        headers: {
          'Authorization': `Bearer ${token}`,
          'content-type': 'application/json'
        },
      }
    );
    const data = await response.json();
    resolve({ data });
  });
}

