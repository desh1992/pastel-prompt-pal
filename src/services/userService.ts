interface UserInfo {
    name: string;
    email: string;
    companyName: string;
    accessToken: string;
  }
  
  export const saveUser = (user: UserInfo) => {
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('company_name', user.companyName);
    localStorage.setItem('access_token', user.accessToken);
  };
  
  export const getUser = (): UserInfo | null => {
    const name = localStorage.getItem('user_name');
    const email = localStorage.getItem('user_email');
    const companyName = localStorage.getItem('company_name');
    const accessToken = localStorage.getItem('access_token');
  
    if (name && email && companyName && accessToken) {
      return { name, email, companyName, accessToken };
    }
  
    return null;
  };
  
  export const logoutUser = () => {
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('company_name');
    localStorage.removeItem('access_token');
  };
  