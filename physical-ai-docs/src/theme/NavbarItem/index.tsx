import React from 'react';
import NavbarItem from '@theme-original/NavbarItem';
import CustomLogoutButton from './CustomLogoutButton';

export default function NavbarItemWrapper(props: any) {
  if (props.type === 'custom-logout-button') {
    return <CustomLogoutButton {...props} />;
  }
  return <NavbarItem {...props} />;
}
