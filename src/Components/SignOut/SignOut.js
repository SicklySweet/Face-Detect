import React from 'react';

const SignOut = ({ onRouteChange, isSignedIn }) => {
    if (isSignedIn) {
    return (
        <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
            <p onClick = {() => onRouteChange('signOut')} className='f3 link dim white pa3 pointer'>Sign Out</p>
        </nav>
    );
    } else {
        return (
            <nav style={{display: 'flex', justifyContent: 'flex-end'}}>
                <p onClick = {() => onRouteChange('signIn')} className='f3 link dim white pa3 pointer'>Sign In</p>
                <p onClick = {() => onRouteChange('Register')} className='f3 link dim white pa3 pointer'>Register</p>
            </nav>
            );
        }
}

export default SignOut;