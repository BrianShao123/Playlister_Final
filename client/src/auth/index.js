import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'
const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    ACCOUNT_ERROR: "ACCOUNT_ERROR",
    OK_RESPONSE: "OK_RESPONSE"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        error: false,
        errMessage: null
    });

    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    error: false,
                    errMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: false,
                    errMessage: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: false,
                    errMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    error: false,
                    errMessage: null
                })
            }
            case AuthActionType.ACCOUNT_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: payload.errs,
                    errMessage: payload.msg
                })
            }
            case AuthActionType.OK_RESPONSE: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    error: false,
                    errMessage: null
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        console.log("getLoggedIn response: ");
        console.log(response);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(userName, firstName, lastName, email, password, passwordVerify) {
        try {
        const response = await api.registerUser(userName, firstName, lastName, email, password, passwordVerify);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/login");
        }
    }
    catch(err) {
        console.log("error is " + err);
        let errorCode = err.toString().replace(/\D/g,'');
        console.log("error code is " + errorCode); 
        let errorMessage = "";
        if(errorCode == 400)
        {
            errorMessage = "Please enter all required fields.";
        }
        else if(errorCode == 401) 
        {
            errorMessage = "Please enter a password of at least 8 characters.";
        }
        else if(errorCode == 402) 
        {
            errorMessage = "Please enter the same password twice.";
        }
        else if(errorCode == 403) 
        {
            errorMessage = "An account with this email address already exists.";
        }
        authReducer({
            type: AuthActionType.ACCOUNT_ERROR,
            payload: {
                errs: true,
                msg: errorMessage
            }
        })
        
    }
    }

    auth.loginUser = async function(email, password) {
        try {
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            
            console.log(response.data.user);
            history.push("/");
        }
    }
    catch(err) {
        console.log("error is " + err);
        let errorCode = err.toString().replace(/\D/g,'');
        console.log("error code is " + errorCode); 
        let errorMessage = "";
        if(errorCode == 400)
        {
            errorMessage = "Please enter all required fields."
        }
        else if(errorCode == 401) 
        {
            errorMessage = "Wrong email or password provided.";
        }
        authReducer({
            type: AuthActionType.ACCOUNT_ERROR,
            payload: {
                errs: true,
                msg: errorMessage
            }
        })
        
    }
    }

    auth.closeModal = async function() {
        authReducer({
            type: AuthActionType.OK_RESPONSE,
            payload: {
                error: false
            }
        })
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };