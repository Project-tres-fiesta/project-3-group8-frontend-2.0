import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
    isErrorWithCode,
    isSuccessResponse,
} from '@react-native-google-signin/google-signin';


export default function Auth() {
    GoogleSignin.configure({
       webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    });

    return (
        <GoogleSigninButton
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={async () => {
                try {
                    await GoogleSignin.hasPlayServices();
                    const response = await GoogleSignin.signIn();
                    console.log(JSON.stringify(response, null, 2));
                    if (isSuccessResponse(response)) {

                    // //setState({ userInfo: response.data });
                    // } else {
                    // // sign in was cancelled by user
                     }
                } catch (error: any) {
                    if (isErrorWithCode(error)) {
                        switch (error.code) {
                            case statusCodes.IN_PROGRESS:
                            // operation (eg. sign in) already in progress
                            break;
                            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                            // Android only, play services not available or outdated
                            break;
                            default:
                            // some other error happened
                        }
                    } else {
                    // an error that's not related to google sign in occurred
                    }
                }
            }}
            //disabled={isInProgress}
        />
    );
}