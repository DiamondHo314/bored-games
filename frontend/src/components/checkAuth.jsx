export async function checkAuth(){
    const BACKEND_URL = 'http://localhost:8080'; 
    try {
    const res = await fetch(`${BACKEND_URL}/login/checkAuth`, {
        credentials: 'include',
    });
    if (res.ok) {
        return true
    } else {
        return false
    }
    } catch (error) {
    console.error('Error checking authentication:', error);
    }
};
