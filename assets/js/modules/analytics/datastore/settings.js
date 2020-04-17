/**
 * modules/analytics data store: settings.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import {
	isValidAccountID,
	isValidInternalWebPropertyID,
	isValidPropertySelection,
	isValidProfileSelection,
	isValidPropertyID,
} from '../util';
import { STORE_NAME, PROPERTY_CREATE, PROFILE_CREATE } from './constants';

const { createRegistrySelector, createRegistryControl } = Data;

// Actions
const SUBMIT_CHANGES = 'SUBMIT_CHANGES';
const START_SUBMIT_CHANGES = 'START_SUBMIT_CHANGES';
const FINISH_SUBMIT_CHANGES = 'FINISH_SUBMIT_CHANGES';

export const INITIAL_STATE = {
	isDoingSubmitChanges: false,
};

export const actions = {
	*submitChanges() {
		yield {
			payload: {},
			type: START_SUBMIT_CHANGES,
		};

		yield {
			payload: {},
			type: SUBMIT_CHANGES,
		};

		yield {
			payload: {},
			type: FINISH_SUBMIT_CHANGES,
		};
	},
};

export const controls = {
	[ SUBMIT_CHANGES ]: createRegistryControl( ( registry ) => async () => {
		let propertyID = registry.select( STORE_NAME ).getPropertyID();

		if ( propertyID === PROPERTY_CREATE ) {
			const accountID = registry.select( STORE_NAME ).getAccountID();

			const { response: property, error } = await registry.dispatch( STORE_NAME ).createProperty( accountID );

			if ( error ) {
				return { error };
			}
			propertyID = property.id;
		}

		const profileID = registry.select( STORE_NAME ).getProfileID();

		if ( profileID === PROFILE_CREATE ) {
			const accountID = registry.select( STORE_NAME ).getAccountID();

			const { error } = await registry.dispatch( STORE_NAME ).createProfile( accountID, propertyID );

			if ( error ) {
				return { error };
			}
		}

		// This action shouldn't be called if settings haven't changed,
		// but this prevents errors in tests.
		if ( registry.select( STORE_NAME ).haveSettingsChanged() ) {
			const { error } = await registry.dispatch( STORE_NAME ).saveSettings();

			if ( error ) {
				return { error };
			}
		}
	} ),
};

export const reducer = ( state, { type } ) => {
	switch ( type ) {
		case START_SUBMIT_CHANGES: {
			return {
				...state,
				isDoingSubmitChanges: true,
			};
		}

		case FINISH_SUBMIT_CHANGES: {
			return {
				...state,
				isDoingSubmitChanges: false,
			};
		}

		default: return state;
	}
};

export const resolvers = {};

export const selectors = {
	/**
	 * Checks if changes can be submitted.
	 */
	canSubmitChanges: createRegistrySelector( ( select ) => () => {
		const {
			getAccountID,
			getInternalWebPropertyID,
			getProfileID,
			getPropertyID,
			hasExistingTagPermission,
			haveSettingsChanged,
			isDoingSubmitChanges,
		} = select( STORE_NAME );

		if ( isDoingSubmitChanges() ) {
			return false;
		}
		if ( ! haveSettingsChanged() ) {
			return false;
		}
		if ( ! isValidAccountID( getAccountID() ) ) {
			return false;
		}
		if ( ! isValidPropertySelection( getPropertyID() ) ) {
			return false;
		}
		if ( ! isValidProfileSelection( getProfileID() ) ) {
			return false;
		}
		// If the property ID is valid (non-create) the internal ID must be valid as well.
		if ( isValidPropertyID( getPropertyID() ) && ! isValidInternalWebPropertyID( getInternalWebPropertyID() ) ) {
			return false;
		}
		// Do existing tag check last.
		if ( hasExistingTagPermission() === false ) {
			return false;
		}

		return true;
	} ),

	isDoingSubmitChanges( state ) {
		return !! state.isDoingSubmitChanges;
	},
};

export default {
	INITIAL_STATE,
	actions,
	controls,
	reducer,
	resolvers,
	selectors,
};

