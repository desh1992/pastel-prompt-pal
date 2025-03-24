interface UserInfo {
    userId: string;
    accessToken: string;
    email: string;
    name: string;
    companyName: string;
  }
  
  let currentUser: UserInfo | null = null;
  
  export const userService = {
    setUser: (data: any) => {
      const user: UserInfo = {
        userId: data.userId,
        accessToken: data.access_token,
        email: data.email,
        name: data.name,
        companyName: data.company_name,
      };
  
      currentUser = user;
  
      localStorage.setItem('access_token', user.accessToken);
      localStorage.setItem('user_id', user.userId);
      localStorage.setItem('user_email', user.email);
      localStorage.setItem('user_name', user.name);
      localStorage.setItem('user_company', user.companyName);
    },
  
    getUser: (): UserInfo | null => {
      if (currentUser) return currentUser;
  
      const accessToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');
      const email = localStorage.getItem('user_email');
      const name = localStorage.getItem('user_name');
      const companyName = localStorage.getItem('user_company');
  
      if (accessToken && userId && email && name && companyName) {
        currentUser = {
          accessToken,
          userId,
          email,
          name,
          companyName,
        };
        return currentUser;
      }
  
      return null;
    },
  
    logout: () => {
      currentUser = null;
      localStorage.clear();
    }
  };
  