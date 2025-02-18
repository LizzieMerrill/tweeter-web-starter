import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import { useState } from "react";

interface Props {
  navPresenterGenerator: (view: UserNavigationView) => UserNavigationPresenter;
}

const useUserNavigationHook = (props: Props) =>{
    const { displayErrorMessage } = useToastListener();
      const { setDisplayedUser, currentUser, authToken } =
        useUserInfoHook();
      //   const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
      //       event.preventDefault();
        
      //       try {
      //         const alias = extractAlias(event.target.toString());
        
      //         const user = await presenter.getUser(authToken!, alias);
        
      //         if (!!user) {
      //           if (currentUser!.equals(user)) {
      //             setDisplayedUser(currentUser!);
      //           } else {
      //             setDisplayedUser(user);
      //           }
      //         }
      //       } catch (error) {
      //         displayErrorMessage(`Failed to get user because of exception: ${error}`);
      //       }
      //     };
    
      // const extractAlias = (value: string): string => {
      //   const index = value.indexOf("@");
      //   return value.substring(index);
      // };

          const listener: UserNavigationView = {
            displayErrorMessage: displayErrorMessage,
            setDisplayedUser: setDisplayedUser
          }
          
          const [presenter] = useState(props.navPresenterGenerator(listener));

    return presenter.navigateToUser;
}
export default useUserNavigationHook;