/**
 * Analytics module initialization.
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
import domReady from '@wordpress/dom-ready';

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import './datastore';
import Widgets from 'googlesitekit-widgets';
import { AREA_DASHBOARD_ALL_TRAFFIC, AREA_PAGE_DASHBOARD_ALL_TRAFFIC } from '../../googlesitekit/widgets/default-areas';
import { fillFilterWithComponent } from '../../util';
import { SetupMain as AnalyticsSetup } from './components/setup';
import { SettingsMain as AnalyticsSettings } from './components/settings';
import DashboardAllTrafficWidget from './components/dashboard/DashboardAllTrafficWidget';
import DashboardGoalsWidget from './components/dashboard/DashboardGoalsWidget';
import DashboardUniqueVisitorsWidget from './components/dashboard/DashboardUniqueVisitorsWidget';
import DashboardBounceRateWidget from './components/dashboard/DashboardBounceRateWidget';

addFilter(
	'googlesitekit.ModuleSetup-analytics',
	'googlesitekit.AnalyticsModuleSetup',
	compose( fillFilterWithComponent )( AnalyticsSetup )
);

addFilter(
	'googlesitekit.ModuleSettingsDetails-analytics',
	'googlesitekit.AnalyticsModuleSettings',
	compose( fillFilterWithComponent )( AnalyticsSettings )
);

domReady( () => {
	Widgets.registerWidget(
		'analyticsAllTraffic',
		{
			component: DashboardAllTrafficWidget,
			width: Widgets.WIDGET_WIDTHS.FULL,
			priority: 1,
			wrapWidget: true,
		},
		[
			AREA_DASHBOARD_ALL_TRAFFIC,
			AREA_PAGE_DASHBOARD_ALL_TRAFFIC,
		],
	);

	Widgets.registerWidget(
		'analyticsGoals',
		{
			component: DashboardGoalsWidget,
			width: Widgets.WIDGET_WIDTHS.QUARTER,
			priority: 4,
			wrapWidget: true,
		},
		[
			AREA_DASHBOARD_ALL_TRAFFIC,
		],
	);

	Widgets.registerWidget(
		'analyticsUniqueVisitors',
		{
			component: DashboardUniqueVisitorsWidget,
			width: Widgets.WIDGET_WIDTHS.QUARTER,
			priority: 3,
			wrapWidget: true,
		},
		[
			AREA_DASHBOARD_ALL_TRAFFIC,
			AREA_PAGE_DASHBOARD_ALL_TRAFFIC,
		],
	);

	Widgets.registerWidget(
		'analyticsBounceRate',
		{
			component: DashboardBounceRateWidget,
			width: Widgets.WIDGET_WIDTHS.QUARTER,
			priority: 4,
			wrapWidget: true,
		},
		[
			AREA_PAGE_DASHBOARD_ALL_TRAFFIC,
		],
	);
} );
