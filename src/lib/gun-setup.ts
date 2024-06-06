/* eslint-disable @typescript-eslint/no-explicit-any */
import type { GunOptions } from 'gun';
import Gun from 'gun/gun';
import 'gun/sea';
import { writable } from 'svelte/store';

const gunOptions: GunOptions = {
  peers: ['https://gun-manhattan.herokuapp.com/gun'],
};

export const db = Gun(gunOptions);
export const user = db.user().recall({ sessionStorage: true });

export const username = writable('');
export const usersea = writable({});
export const peerToView = writable({});

db.on( 'auth', async () => {
    const alias = await user.get( 'alias' );

    username.set( alias || '' );
    usersea.set( user._.sea );
   
    console.log( 'signed in as', alias || undefined );
    console.log( 'usersea', user._.sea );
   
} );
