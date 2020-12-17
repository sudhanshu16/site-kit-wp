/**
 * WidgetActivateModuleCTA component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { STORE_NAME } from '../datastore/constants';
import ActivateModuleCTA from '../../../components/ActivateModuleCTA';

const { useDispatch } = Data;

export default function WidgetActivateModuleCTA( { widgetSlug, moduleSlug, ...props } ) {
	const { setWidgetState, unsetWidgetState } = useDispatch( STORE_NAME );

	useEffect( () => {
		const metadata = { slug: moduleSlug };
		setWidgetState( widgetSlug, ActivateModuleCTA, metadata );
		return () => {
			unsetWidgetState( widgetSlug, ActivateModuleCTA, metadata );
		};
	}, [ widgetSlug, moduleSlug ] );

	return <ActivateModuleCTA slug={ moduleSlug } { ...props } />;
}

WidgetActivateModuleCTA.propTypes = {
	widgetSlug: PropTypes.string.isRequired,
	moduleSlug: PropTypes.string.isRequired,
};