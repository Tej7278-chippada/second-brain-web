// src/components/GoogleOAuth.js
import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Box, CircularProgress, Alert } from "@mui/material";
import { authServices } from '../services/api';

const GoogleOAuth = ({ onSuccess, onError }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    const handleGoogleSuccess = async (credentialResponse) => {
        if (isLoading) return;
        
        setIsLoading(true);
        onError(null);

        try {
            if (!credentialResponse?.credential) {
                throw new Error('Invalid credential response from Google');
            }

            // Call Flask backend
            const response = await authServices.googleLogin(
                credentialResponse.credential,
                process.env.REACT_APP_GOOGLE_CLIENT_ID
            );

            // Validate response
            const { authToken, user } = response; // , isNewUser, message
            
            if (!authToken || !user) {
                throw new Error('Incomplete authentication response');
            }

            // Success - pass to parent
            onSuccess(response);
            
        } catch (error) {
            console.error("Google OAuth error:", error);
            
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.response?.status === 403) {
                errorMessage = error.response.data?.error || 'Access denied';
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message.includes('network')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            onError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleError = (error) => {
        console.error("Google OAuth client error:", error);
        
        let errorMessage = 'Google login failed.';
        
        if (error === 'popup_closed_by_user') {
            errorMessage = 'Login cancelled.';
        } else if (error === 'access_denied') {
            errorMessage = 'Access denied by Google.';
        }
        
        onError(errorMessage);
    };

    const handleScriptLoadSuccess = () => {
        // console.log("Google OAuth script loaded successfully");
        setScriptLoaded(true);
    };

    // Don't render if client ID is missing
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Alert severity="error">
                    Google OAuth is not configured. Please contact support.
                </Alert>
            </Box>
        );
    }

    return (
        <GoogleOAuthProvider 
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            onScriptLoadSuccess={handleScriptLoadSuccess}
            onScriptLoadError={() => {
                onError('Failed to load Google Sign-In');
                setScriptLoaded(false);
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}> {/* , width: '100%' */}
                {isLoading && (
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            bottom: 0, 
                            left: 0,
                            right: 0,
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            zIndex: 1,
                            borderRadius: '24px'
                        }}
                    >
                        <CircularProgress size={24} />
                    </Box>
                )}

                {scriptLoaded ? (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false} // all mails showing in a popup card at page mounting (Disable if issues persist)
                        // ux_mode="redirect" // Alternative to popup
                        theme="outline"
                        shape="pill"
                        size="large"
                        text="continue_with"
                        disabled={isLoading}
                        // width="300"
                        cancel_on_tap_outside={false}
                        auto_select={false}
                        context="signin"
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
                        <CircularProgress size={20} />
                        <span>Loading Google Sign-In...</span>
                    </Box>
                )}
            </Box>
        </GoogleOAuthProvider>
    );
};

export default GoogleOAuth;