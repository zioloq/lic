<?php
/*
Plugin Name: Booking Calendar
Plugin URI: https://wpbookingcalendar.com/demo/
Description: <a href="https://wpbookingcalendar.com/"><strong>Booking Calendar</strong></a> is the original first and most popular WordPress booking plugin. <strong>Show your availability</strong> on a calendar, receive and manage <strong>full-day</strong> or <strong>time-slot bookings</strong> in a modern and intuitive booking panel. <strong>Sync</strong> your events and <strong>schedule appointments</strong> with ease using this <strong>awesome booking system</strong>.
Author: wpdevelop, oplugins
Author URI: https://wpbookingcalendar.com/
Text Domain: booking
Domain Path: /languages/
Version: 9.7.2
*/

/*  Copyright 2009 - 2023  www.wpbookingcalendar.com  (email: info@wpbookingcalendar.com),

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>
*/
    
if ( ! defined( 'ABSPATH' ) ) die( '<h3>Direct access to this file do not allow!</h3>' );       // Exit if accessed directly


if ( ! defined( 'WP_BK_VERSION_NUM' ) ) {       define( 'WP_BK_VERSION_NUM',    '9.7.2' ); }
if ( ! defined( 'WP_BK_MINOR_UPDATE' ) ) {      define( 'WP_BK_MINOR_UPDATE',   true ); }


////////////////////////////////////////////////////////////////////////////////
// PRIMARY URL CONSTANTS                        
////////////////////////////////////////////////////////////////////////////////

// ..\home\siteurl\www\wp-content\plugins\plugin-name\wpdev-booking.php
if ( ! defined( 'WPBC_FILE' ) )             define( 'WPBC_FILE', __FILE__ ); 

// wpdev-booking.php
if ( ! defined('WPBC_PLUGIN_FILENAME' ) )   define('WPBC_PLUGIN_FILENAME', basename( __FILE__ ) );                     

// plugin-name    
if ( ! defined('WPBC_PLUGIN_DIRNAME' ) )    define('WPBC_PLUGIN_DIRNAME',  plugin_basename( dirname( __FILE__ ) )  );  

// ..\home\siteurl\www\wp-content\plugins\plugin-name
if ( ! defined('WPBC_PLUGIN_DIR' ) )        define('WPBC_PLUGIN_DIR', untrailingslashit( plugin_dir_path( WPBC_FILE ) )  );

// http: //website.com/wp-content/plugins/plugin-name
if ( ! defined('WPBC_PLUGIN_URL' ) )        define('WPBC_PLUGIN_URL', untrailingslashit( plugins_url( '', WPBC_FILE ) )  );     

if ( ! defined('WP_BK_MIN_WP_VERSION' ) )   define('WP_BK_MIN_WP_VERSION',  '4.0');    //Minimum required WP version        //FixIn: 7.0.1.6

require_once WPBC_PLUGIN_DIR . '/core/wpbc.php';