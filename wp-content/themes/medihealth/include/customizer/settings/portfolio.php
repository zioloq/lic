<?php
/**
 * Portfolio Customizer Settings
 *
 * @package MediHealth WordPress theme
 */

	/**
	 * Section
	 */
	$wp_customize->add_section( 'medihealth_portfolio_section' , array(
		'title' 			=> __( 'Portfolio', 'medihealth' ),
		'priority' 			=> 6,
		'panel' 			=> 'medihealth_theme_options',
		) 
	);

		/**
		 * Portfolio Section
		 */
		$wp_customize->add_setting( 'medihealth_portfolio_setting', array(
				'default'           	=> '',
				'sanitize_callback' 	=> 'medihealth_sanitize_checkbox',
			) 
		);

		$wp_customize->add_control( new MediHealth_Customizer_Toggle_Control( $wp_customize, 'medihealth_portfolio_setting', array(
				'label'	   				=> __( 'Enable Portfolio Section', 'medihealth' ),
				'type'					=> 'checkbox',
				'section'  				=> 'medihealth_portfolio_section',
				'settings' 				=> 'medihealth_portfolio_setting',
				'priority' 				=> 1,
				) 
			) 
		);

		/**
		 * Portfolio Title
		 */
		$wp_customize->add_setting('medihealth_portfolio_section_title', array(
				'default' 					=> __( 'Hospital Works', 'medihealth' ),
				'sanitize_callback' 		=> 'sanitize_text_field'
			)
		);
		$wp_customize->add_control('medihealth_portfolio_section_title', array(
				'label' 					=> __( 'Section Title', 'medihealth' ),
				'section' 					=> 'medihealth_portfolio_section',
				'type'		 				=> 'text',
				'description'  				=> __('Set the portfolio section title. (For front page only)', 'medihealth'),
				'priority' 					=> 1,
				'active_callback'			=> 'medihealth_portfolio_setting_cb'
			)
		);


		/**
		 * Portfolio Description
		 */
		$wp_customize->add_setting('medihealth_portfolio_section_description', array(
				'default' 					=> __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 'medihealth' ),
				'sanitize_callback' 		=> 'sanitize_textarea_field'
			)
		);
		$wp_customize->add_control('medihealth_portfolio_section_description', array(
				'label' 				=> __( 'Portfolio Section Description', 'medihealth' ),
				'description'	   		=> __( 'Set the portfolio section description. (For front page only)', 'medihealth' ),
				'section' 				=> 'medihealth_portfolio_section',
				'type'					=> 'textarea',
				'priority' 				=> 1,
				'active_callback'			=> 'medihealth_portfolio_setting_cb'
			)
		);

		/**
		 * Portfolio - Number of Portfolio
		 */
		$wp_customize->add_setting( 'medihealth_portfolio_items_setting', array(
			'default'           	=> __( '3', 'medihealth'),
			'sanitize_callback' 	=> 'medihealth_sanitize_number',
			) 
		);

		$wp_customize->add_control( new MediHealth_Customizer_Range_Slider_Control( $wp_customize, 'medihealth_portfolio_items_setting', array(
				'label'	   				=> __( 'Number Of Portfolios', 'medihealth' ),
				'description'	   		=> __( 'Maximum is 6.', 'medihealth' ),
				'type'           		=> 'number',
				'section'  				=> 'medihealth_portfolio_section',
				'settings' 				=> 'medihealth_portfolio_items_setting',
				'priority' 				=> 2,
				'input_attrs' 			=> array(
					'min'				=> __( '1', 'medihealth'),
					'max' 				=> __( '6', 'medihealth'),
					'step' 				=> __( '1', 'medihealth'),
				),
				'active_callback'		=> 'medihealth_portfolio_setting_cb',
				) 
			) 
		);

		/**
		 * Portfolio - Content Type
		 */
		$wp_customize->add_setting( 'medihealth_portfolio_content_setting', array(
			'default'           	=> __('portfolio_post', 'medihealth'),
			'sanitize_callback' 	=> 'medihealth_sanitize_select',
			) 
		);

		$wp_customize->add_control( new MediHealth_Customizer_Select_Control( $wp_customize, 'medihealth_portfolio_content_setting', array(
				'label'	   				=> __( 'Content Type', 'medihealth' ),
				'type'           		=> 'radio',
				'section'  				=> 'medihealth_portfolio_section',
				'settings' 				=> 'medihealth_portfolio_content_setting',
				'priority' 				=> 2,
				'choices' 				=> array(
					'portfolio_post'  	=> __( 'Post', 'medihealth' ),
					'portfolio_page' 	=> __( 'Page', 'medihealth' ),
				),
				'active_callback'		=> 'medihealth_portfolio_setting_cb',
				) 
			) 
		);

		// Post - 1
		$wp_customize->add_setting('medihealth_portfolio_post_1', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_post_1', array(
			'label'       		=> __('Select Post #1', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_post_1',
			'type'        		=> 'select',
			'priority' 			=> 2,
			'choices'	  		=>  medihealth_dropdown_posts(),
			'active_callback' 	=> 'medihealth_portfolio_post_1_pp',
			)
		);

		// Post - 2
		$wp_customize->add_setting('medihealth_portfolio_post_2', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_post_2', array(
			'label'       		=> __('Select Post #2', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_post_2',
			'type'        		=> 'select',
			'priority' 			=> 2,
			'choices'	  		=>  medihealth_dropdown_posts(),
			'active_callback' 	=> 'medihealth_portfolio_post_2_pp',
			)
		);

		// Post - 3
		$wp_customize->add_setting('medihealth_portfolio_post_3', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_post_3', array(
			'label'       		=> __('Select Post #3', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_post_3',
			'type'        		=> 'select',
			'priority' 			=> 2,
			'choices'	  		=>  medihealth_dropdown_posts(),
			'active_callback' 	=> 'medihealth_portfolio_post_3_pp',
			)
		);

		// Post - 4
		$wp_customize->add_setting('medihealth_portfolio_post_4', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_post_4', array(
			'label'       		=> __('Select Post #4', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_post_4',
			'type'        		=> 'select',
			'priority' 			=> 2,
			'choices'	  		=>  medihealth_dropdown_posts(),
			'active_callback' 	=> 'medihealth_portfolio_post_4_pp',
			)
		);

		// Post - 5
		$wp_customize->add_setting('medihealth_portfolio_post_5', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_post_5', array(
			'label'       		=> __('Select Post #5', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_post_5',
			'type'        		=> 'select',
			'priority' 			=> 2,
			'choices'	  		=>  medihealth_dropdown_posts(),
			'active_callback' 	=> 'medihealth_portfolio_post_5_pp',
			)
		);

		// Post - 6
		$wp_customize->add_setting('medihealth_portfolio_post_6', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_post_6', array(
			'label'       		=> __('Select Post #6', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_post_6',
			'type'        		=> 'select',
			'priority' 			=> 2,
			'choices'	  		=>  medihealth_dropdown_posts(),
			'active_callback' 	=> 'medihealth_portfolio_post_6_pp',
			)
		);


		// Page - 1
		$wp_customize->add_setting('medihealth_portfolio_page_1', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_page_1', array(
			'label'       		=> __('Select Page #1', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_page_1',
			'type'        		=> 'dropdown-pages',
			'priority' 			=> 2,
			'active_callback' 	=> 'medihealth_portfolio_page_1_pp',
			)
		);


		// Page - 2
		$wp_customize->add_setting('medihealth_portfolio_page_2', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_page_2', array(
			'label'       		=> __('Select Page #2', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_page_2',
			'type'        		=> 'dropdown-pages',
			'priority' 			=> 2,
			'active_callback' 	=> 'medihealth_portfolio_page_2_pp',
			)
		);


		// Page - 3
		$wp_customize->add_setting('medihealth_portfolio_page_3', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_page_3', array(
			'label'       		=> __('Select Page #3', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_page_3',
			'type'        		=> 'dropdown-pages',
			'priority' 			=> 2,
			'active_callback' 	=> 'medihealth_portfolio_page_3_pp',
			)
		);

		// Page - 4
		$wp_customize->add_setting('medihealth_portfolio_page_4', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_page_4', array(
			'label'       		=> __('Select Page #4', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_page_4',
			'type'        		=> 'dropdown-pages',
			'priority' 			=> 2,
			'active_callback' 	=> 'medihealth_portfolio_page_4_pp',
			)
		);

		// Page - 5
		$wp_customize->add_setting('medihealth_portfolio_page_5', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_page_5', array(
			'label'       		=> __('Select Page #5', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_page_5',
			'type'        		=> 'dropdown-pages',
			'priority' 			=> 2,
			'active_callback' 	=> 'medihealth_portfolio_page_5_pp',
			)
		);

		// Page - 6
		$wp_customize->add_setting('medihealth_portfolio_page_6', array(
			'type'              => 'theme_mod',
			'capability'        => 'edit_theme_options',
			'sanitize_callback' => 'medihealth_dropdown_pages'
			)
		);

		$wp_customize->add_control('medihealth_portfolio_page_6', array(
			'label'       		=> __('Select Page #6', 'medihealth'),
			'section'     		=> 'medihealth_portfolio_section',
			'settings'    		=> 'medihealth_portfolio_page_6',
			'type'        		=> 'dropdown-pages',
			'priority' 			=> 2,
			'active_callback' 	=> 'medihealth_portfolio_page_6_pp',
			)
		);