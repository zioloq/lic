<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/documentation/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'GGZ~T48m}7F|7nMC(lI,Sxiv)&BZH}Z)Q~zm(H+>$PF!W;Y09uIWY/u H|;rC)jq' );
define( 'SECURE_AUTH_KEY',  'byDb%Yq#?1C7JK#iX?1i`](30x#y:8k8e@Vi986%{O+Ezi3wlY{9^$/ga@<0Xu7(' );
define( 'LOGGED_IN_KEY',    ';1?LR]%KQ@wp3c ihe_$$oAxJrsB8I]591n4*+Ya]xEV$J$?y0ww^YM@DGcSoYWy' );
define( 'NONCE_KEY',        '@7B@BPH|aU!Vk;w v12Bw+S$rKT%Q5j@4{_3..]@l:$|ni758F)}D;}w!,Ok i%K' );
define( 'AUTH_SALT',        '4<yyCe(|aLEK)46EtwoH0zj}/_COg-R^_}gS<)-:Z>Q,Bk7iC20!<5#.v,_>1&xY' );
define( 'SECURE_AUTH_SALT', 'c=*j_pTYQ#T*MZI8jP0ZNt&Giq/.}Ue]W^UKm5O#=eb4xEl*!AC_X(Wu&{yq5spc' );
define( 'LOGGED_IN_SALT',   'RH@-vcR?r(qsgQ=16?zEf9fT$W26`*v senYG2K<Tkhb9%+kDa[fy2]FWY;bylX2' );
define( 'NONCE_SALT',       '_p>2*uK(Dr}8**XHd&Sx~FB@| #|ikGQ71?Q`URM9ua`Q[@A!N~K>x``gk~$,H$D' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/documentation/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
