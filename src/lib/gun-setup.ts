/* eslint-disable @typescript-eslint/no-explicit-any */
import Gun from 'gun/gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';
import type { IGunChain } from 'gun/types';

export const db = Gun();

export const createMapStore = ( ref : IGunChain<any, any> ) => {
    const { update, subscribe } = writable( {} );

    ref.on( ( data, key ) => {
        if ( data ) {
            update( store => ( { ...store, [key]: data } ) );
        } else {
            update( ( store: { [key: string]: any } ) => {
                delete store[key];
                return store;
            } );
        }
    } );

    return {
        subscribe,
        update: ( key: string, value: any ) => ref.get( key ).put( value )
    };
}

// const usersRef = db.get( 'securimed/users' ).map();
// console.log( typeof usersRef );
// export const users = createMapStore( usersRef, {} );

export const user = db.user().recall({ sessionStorage: true });

export const username = writable('');

db.on( 'auth', async () => {
    const alias = await user.get( 'alias' );
    username.set( alias || '' );
    console.log(`signed in as ${alias}`);
} );


