// JavaScript Document

function google_business_reviews_rating_admin(popstate) {
	if (typeof popstate == 'undefined') {
		var popstate = false;
	}

	var place_id = null,
		google_api_key = null,
		language = null,
		languages = {},
		update = null,
		section = null,
		data = [],
		review = {},
		reviews = [],
		order = [],
		relative_times = {},
		e = null,
		i = 0,
		j = 0,
		k = 0,
		count = 0,
		empty_reviews = 0,
		regex = null,
		html = null,
		review_limit = (jQuery('#review-limit').length && jQuery('#review-limit').val().length && jQuery('#review-limit').val().match(/^\d+(?:\.\d+)?$/)) ? parseInt(jQuery('#review-limit').val()) : null,
		existing_review_limit = (review_limit != null && review_limit > 1) ? review_limit : 1,
		existing = false,
		existing_show = false,
		existing_button = null,
		theme_columns = 1,
		time_unit = null,
		date_temp = null,
		date_estimate = null,
		date_actual = null,
		translated = false,
		any_translated = false,
		base_language = true,
		today_string = '',
		message = '',
		text = '',
		row = '';
	
	if (jQuery('#google-business-reviews-rating-settings').length) {
		place_id = jQuery('#place-id').val();
		google_api_key = jQuery('#api-key').val();
	}
	
	if (jQuery('.section', '#wpbody-content').length) {
		if (!jQuery('.nav-tab-active', jQuery('nav:eq(0)', '#wpbody-content')).length || typeof window.location.hash == 'string' && window.location.hash.length) {
			jQuery('.section', '#wpbody-content').each(function(section_index) {
				section = (typeof window.location.hash == 'string' && window.location.hash.length) ? window.location.hash.replace(/^#([\w-]+)/, '$1') : null;

				if (section == null && section_index == 0 || section != null && section == jQuery(this).attr('id')) {
					if (jQuery(this).hasClass('hide')) {
						jQuery(this).removeClass('hide');
					}
				}
				else if (!jQuery(this).hasClass('hide')) {
					jQuery(this).addClass('hide');
				}
			});
			
			if (jQuery('.nav-tab-active', jQuery('nav:eq(0)', '#wpbody-content')).length >= 1) {
				jQuery('.nav-tab-active', jQuery('nav:eq(0)', '#wpbody-content')).each(function(section_index) {
					if (section != null && jQuery(this).attr('href') != '#' + section || section == null && section_index == 0) {
						jQuery(this).removeClass('nav-tab-active');
					}
				});
			}
			
			jQuery('.nav-tab', jQuery('nav:eq(0)', '#wpbody-content')).each(function(tab_index) {
				section = (typeof jQuery(this).attr('href') == 'string') ? jQuery(this).attr('href').replace(/^.*#([\w-]+)/, '$1') : null;
				
				if ((tab_index == 0 && (section == null || typeof window.location.hash == 'undefined' || !window.location.hash.length)) || typeof window.location.hash == 'string' && window.location.hash.length && window.location.hash.replace(/^#([\w-]+)/, '$1') == section) {
					jQuery(this).addClass('nav-tab-active').prop('aria-current', 'page');
				}
			});
		}
		
		if (jQuery('#google-credentials-steps').length && jQuery('li', '#google-credentials-steps').length > jQuery('span', '#google-credentials-steps').length) {
			jQuery('li', '#google-credentials-steps').each(function() {
				jQuery(this).html('<span class="text">' + jQuery(this).html() + '</span>');
			});
		}
		
		if (jQuery('#welcome-google-credentials-steps').length && jQuery('li', '#welcome-google-credentials-steps').length > jQuery('span', '#welcome-google-credentials-steps').length) {
			jQuery('li', '#welcome-google-credentials-steps').each(function() {
				jQuery(this).html('<span class="text">' + jQuery(this).html() + '</span>');
			});
		}
		
		if (jQuery('#html-import-instructions').length && jQuery('li', jQuery('#html-import-instructions')).length > jQuery('span', jQuery('#html-import-instructions')).length) {
			jQuery('li', jQuery('#html-import-instructions')).each(function() {
				jQuery(this).html('<span class="text">' + jQuery(this).html() + '</span>');
			});
		}
		
		if (jQuery('#welcome-api-key').length && jQuery('#welcome-google-credentials-steps').length && jQuery('#welcome-api-key').is(':visible') && !jQuery('#welcome-api-key').val().length) {
			jQuery('#welcome-google-credentials-steps').show();
		}
	}
	
	if (popstate) {
		if (jQuery('.section', '#wpbody-content').length) {
			jQuery('.nav-tab', jQuery('nav:eq(0)', '#wpbody-content')).removeClass('nav-tab-active').removeProp('aria-current').removeAttr('aria-current');
		}
		
		return;
	}
	
	if (jQuery('div', '#widgets-right').length) {
		jQuery('div', '#widgets-right').each(function() {
			google_business_reviews_rating_widget(this);
		});
	}

	if (jQuery('#setup.section', '#wpbody-content').length && typeof jQuery('#setup.section', '#wpbody-content').data('hunter') == 'object' && jQuery('#setup.section', '#wpbody-content').data('hunter') != null) {
		data = jQuery('#setup.section', '#wpbody-content').data('hunter');
		google_api_key = (typeof data.api_key == 'string' && data.api_key.length > 10) ? data.api_key : null;
		place_id = (typeof data.place_id == 'string' && data.place_id.length > 10) ? data.place_id : null;
		language = (typeof data.language == 'string' && data.language.length > 1) ? data.language : null;

		if (jQuery('#api-key').length && jQuery('#place-id').length && !jQuery('#place-id').val().length) {
			if (!jQuery('#api-key').val().length) {
				jQuery('#api-key').val(google_api_key);
			}
	
			jQuery('#place-id').val(place_id);
		}

		if (jQuery('#welcome-api-key').length && jQuery('#welcome-place-id').length && !jQuery('#welcome-place-id').val().length) {
			if (!jQuery('#welcome-api-key').val().length) {
				jQuery('#welcome-api-key').val(google_api_key);
				jQuery('#welcome-google-credentials-steps').hide();
			}
	
			jQuery('#welcome-place-id').val(place_id);
		}

		if (language != null) {
			if (jQuery('#language').length && !jQuery('#language').val().length && jQuery('option[value="' + language.replace(/[^\w\s.,_-]/i, '') + '"]', '#language').length) {
				jQuery('#language').val(language);
				jQuery('#retrieval-translate').prop('disabled', false).removeAttr('disabled').parent().removeClass('disabled');
			}
			
			if (jQuery('#welcome-language').length && !jQuery('#welcome-language').val().length && jQuery('option[value="' + language.replace(/[^\w\s.,_-]/i, '') + '"]', '#welcome-language').length) {
				jQuery('#welcome-language').val(language);
				jQuery('#welcome-retrieval-translate').prop('disabled', false).removeAttr('disabled').parent().removeClass('disabled');
			}
		}
	}
	
	if (jQuery('#google-business-reviews-rating-settings').length && jQuery('.section', '#wpbody-content').length) {
		jQuery('.notice, .notice-success, .notice-warning, .notice-error, .updated, .update-nag, .error, .warning, .is-dismissible', jQuery('#google-business-reviews-rating-settings').parent()).each(function() {
			if (!jQuery(this).hasClass('visible') && !jQuery(this).hasClass('invisible') && !jQuery(this).is('#setting-error-settings_updated')) {
				jQuery(this).remove();
			}
		});
		
		setTimeout(function() {
			if (jQuery('.is-dismissible').length) {
				jQuery('.is-dismissible').slideUp(300, function() { jQuery(this).remove(); });
			}
		}, 15000);

		jQuery('#review-limit, #review-limit-hide, #review-limit-set, #review-limit-all', '#wpbody-content').on('change', function() {
			theme_columns = (jQuery('#reviews-theme').length && typeof jQuery('#reviews-theme').val() == 'string' && jQuery('#reviews-theme').val().match(/\b(?:two|three|four)\b/i)) ? ((jQuery('#reviews-theme').val().match(/\bfour\b/i)) ? 4 : ((jQuery('#reviews-theme').val().match(/\bthree\b/i))) ? 3 : 2) : 1;

			if (jQuery(this).is('#review-limit')) {
				review_limit = (typeof jQuery(this).val() == 'number' || typeof jQuery(this).val() == 'string' && jQuery(this).val().match(/^\d+(?:\.\d+)?$/) && parseInt(jQuery(this).val()) >= 0) ? parseInt(jQuery(this).val()) : null;

				if (jQuery('#theme-recommendation-narrow').is(':visible')) {
					jQuery('#theme-recommendation-narrow').slideUp(300);
				}
	
				if (typeof review_limit != 'number') {
					jQuery('#review-limit-hide:checked').prop('checked', false).removeAttr('checked');
					jQuery('#review-limit-set:checked').prop('checked', false).removeAttr('checked');
					jQuery('#review-limit-all').prop('checked', 'checked');
					
					if (jQuery('#theme-recommendation-badge').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbadge\b/i) != null) {
						jQuery('#theme-recommendation-badge').slideDown(300);
					}
					else if (jQuery('#theme-recommendation-columns').is(':hidden') && jQuery('#reviews-theme').val().match(/\bcolumns\b/i) != null) {
						jQuery('#theme-recommendation-columns').slideDown(300);
					}
					else if (jQuery('#theme-recommendation-bubble').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
						jQuery('#theme-recommendation-bubble').slideDown(300);
					}
				}
				else if (typeof review_limit == 'number' && review_limit < 1) {
					jQuery('#review-limit-all:checked').prop('checked', false).removeAttr('checked');
					jQuery('#review-limit-set:checked').prop('checked', false).removeAttr('checked');
					jQuery('#review-limit-hide').prop('checked', 'checked');
						
					if (jQuery('#theme-recommendation-badge').is(':visible') && jQuery('#reviews-theme').val().match(/\bbadge\b/i) != null) {
						jQuery('#theme-recommendation-badge').slideUp(300);
					}
					else if (jQuery('#theme-recommendation-columns').is(':visible') && jQuery('#reviews-theme').val().match(/\bcolumns\b/i) != null) {
						jQuery('#theme-recommendation-columns').slideUp(300);
					}
					else if (jQuery('#theme-recommendation-bubble').is(':visible') && jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
						jQuery('#theme-recommendation-bubble').slideUp(300);
					}
				}
				else {
					jQuery('#review-limit-hide:checked').prop('checked', false).removeAttr('checked');
					jQuery('#review-limit-all:checked').prop('checked', false).removeAttr('checked');
					jQuery('#review-limit-set').prop('checked', 'checked');
											
					if (jQuery('#theme-recommendation-badge').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbadge\b/i) != null) {
						jQuery('#theme-recommendation-badge').slideDown(300);
					}
					
					if (jQuery('#reviews-theme').val().match(/\bcolumns\b/i) != null) {
						if (jQuery('#theme-recommendation-columns').is(':hidden') && review_limit%theme_columns > 0) {
							if (jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
								jQuery('#theme-recommendation-bubble').slideUp(300);
							}
							
							jQuery('#theme-recommendation-columns').slideDown(300);
						}
						else if (jQuery('#theme-recommendation-columns').is(':visible') && review_limit%theme_columns == 0) {
							jQuery('#theme-recommendation-columns').slideUp(300);
							
							if (jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
								jQuery('#theme-recommendation-bubble').slideDown(300);
							}
						}
					}
					else if (jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
						jQuery('#theme-recommendation-bubble').slideDown(300);
					}
				}
			}
			else if (jQuery(this).is('#review-limit-hide')) {
				jQuery('#review-limit').val(0);
				
				if (jQuery('#theme-recommendation-badge').is(':visible') && jQuery('#reviews-theme').val().match(/\bbadge\b/i) != null) {
					jQuery('#theme-recommendation-badge').slideUp(300);
				}
				
				if (jQuery('#theme-recommendation-columns').is(':hidden') && jQuery('#reviews-theme').val().match(/\bcolumns\b/i) != null) {
					jQuery('#theme-recommendation-columns').slideDown(300);
				}
				else if (jQuery('#theme-recommendation-bubble').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
					jQuery('#theme-recommendation-bubble').slideDown(300);
				}
			}
			else if (jQuery(this).is('#review-limit-set')) {
				if (typeof(existing_review_limit) == 'number' && existing_review_limit > 1) {
					review_limit = existing_review_limit;
				}
				else if (typeof(theme_columns) == 'number' && theme_columns > 1) {
					review_limit = theme_columns;
				}
				else {
					review_limit = 1;
				}
								
				jQuery('#review-limit').val(review_limit);
				
				if (jQuery('#theme-recommendation-badge').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbadge\b/i) != null) {
					jQuery('#theme-recommendation-badge').slideDown(300);
				}
				else if (jQuery('#reviews-theme').val().match(/\bcolumns\b/i) != null) {
					if (jQuery('#theme-recommendation-columns').is(':hidden') && review_limit%theme_columns > 0) {
						if (jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
							jQuery('#theme-recommendation-bubble').slideUp(300);
						}
						
						jQuery('#theme-recommendation-columns').slideDown(300);
					}
					else if (jQuery('#theme-recommendation-columns').is(':visible') && review_limit%theme_columns == 0) {
						jQuery('#theme-recommendation-columns').slideUp(300);
						
						if (jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
							jQuery('#theme-recommendation-bubble').slideDown(300);
						}
					}
				}
				else if (jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
					jQuery('#theme-recommendation-bubble').slideDown(300);
				}
			}
			else if (jQuery(this).is('#review-limit-all')) {
				jQuery('#review-limit').val('');
					
				if (jQuery('#theme-recommendation-badge').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbadge\b/i) != null) {
					jQuery('#theme-recommendation-badge').slideDown(300);
				}
				else if (jQuery('#theme-recommendation-columns').is(':hidden') && jQuery('#reviews-theme').val().match(/\bcolumns\b/i) != null) {
					jQuery('#theme-recommendation-columns').slideDown(300);
				}
				else if (jQuery('#theme-recommendation-bubble').is(':hidden') && jQuery('#reviews-theme').val().match(/\bbubble\b/i) != null) {
					jQuery('#theme-recommendation-bubble').slideDown(300);
				}
			}
			
			if (typeof jQuery('#review-limit').val() == 'string' && jQuery('#review-limit').val().length && parseInt(jQuery('#review-limit').val()) >= 2 || typeof jQuery('#review-limit').val() == 'number' && jQuery('#review-limit').val() >= 2) {
				jQuery('#carousel-view').prop('max', parseInt(jQuery('#review-limit').val()) - 1); 
			}
			else {
				jQuery('#carousel-view').prop('max', jQuery('#review-limit').attr('max'));
				
				if (typeof jQuery('#review-limit').val() == 'string' && parseInt(jQuery('#review-limit').val()) < 2 || typeof jQuery('#review-limit').val() == 'number' && jQuery('#review-limit').val() < 2) {
					jQuery('#carousel-view').val(''); 
				}
			}
			
			if ((typeof jQuery('#carousel-view').val() == 'string' && jQuery('#carousel-view').val().length || typeof jQuery('#carousel-view').val() == 'number') && parseInt(jQuery('#carousel-view').val()) > parseInt(jQuery('#carousel-view').attr('max'))) {
				jQuery('#carousel-view').val(jQuery('#carousel-view').attr('max'));
			}

			jQuery(':input', jQuery('.show-reviews', '#wpbody-content')).each(function() {
				if (!jQuery(this).is(':disabled') && (typeof jQuery('#review-limit').val() == 'string' && jQuery('#review-limit').val() == '0' || typeof jQuery('#review-limit').val() == 'number' && jQuery('#review-limit').val() <= 0)) {
					jQuery(this).prop('disabled', true);
				}
				else if (jQuery(this).is(':disabled') && (typeof jQuery('#review-limit').val() == 'string' && jQuery('#review-limit').val() != '0' || typeof jQuery('#review-limit').val() == 'number' && jQuery('#review-limit').val() > 0)) {
					jQuery(this).prop('disabled', false).removeAttr('disabled');
				}
			});
		});
		
		jQuery('#carousel-view', '#wpbody-content').on('change', function() {
			if (typeof jQuery('#review-limit').val() == 'string' && jQuery('#review-limit').val().length || typeof jQuery('#review-limit').val() == 'number' && jQuery('#review-limit').val() > 1) {
				jQuery(this).prop('max', parseInt(jQuery('#review-limit').val()) - 1); 
			}
			
			if ((typeof jQuery(this).val() == 'string' && jQuery(this).val().length || typeof jQuery(this).val() == 'number') && parseInt(jQuery(this).val()) > parseInt(jQuery(this).attr('max'))) {
				jQuery(this).val(jQuery(this).attr('max'));
			}
			
			return;
		});

		jQuery(':input', '#google-business-reviews-rating-setup').on('change', function() {
			return google_business_reviews_rating_preview(this);
		});
				
		jQuery('#reviews-theme', '#wpbody-content').on('change', function() {
			review_limit = (jQuery('#review-limit').length && jQuery('#review-limit').val().length && jQuery('#review-limit').val().match(/^\d+(?:\.\d+)?$/)) ? parseInt(jQuery('#review-limit').val()) : null;
			theme_columns = (jQuery('#reviews-theme').length && typeof jQuery('#reviews-theme').val() == 'string' && jQuery('#reviews-theme').val().match(/\b(?:two|three|four)\b/i)) ? ((jQuery('#reviews-theme').val().match(/\bfour\b/i)) ? 4 : ((jQuery('#reviews-theme').val().match(/\bthree\b/i))) ? 3 : 2) : 1;
			
			if (jQuery('#theme-recommendation-narrow').is(':visible') && (jQuery('#reviews-theme').val().match(/\bnarrow\b/i) == null || jQuery('#theme-recommendation-badge').is(':visible') || jQuery('#theme-recommendation-bubble').is(':visible'))) {
				jQuery('#theme-recommendation-narrow').slideUp(300);
			}
			
			if (jQuery('#theme-recommendation-badge').is(':hidden') && jQuery(this).val().match(/\bbadge\b/i) != null && (review_limit == null || review_limit >= 1)) {
				if (jQuery('#theme-recommendation-bubble').is(':visible')) {
					jQuery('#theme-recommendation-bubble').slideUp(300);
				}
				
				jQuery('#theme-recommendation-badge').slideDown(300);
			}
			else if (jQuery('#theme-recommendation-badge').is(':visible') && jQuery(this).val().match(/\bbadge\b/i) == null) {
				jQuery('#theme-recommendation-badge').slideUp(300);
			}
	
			if (jQuery(this).val().match(/\bcolumns\b/i) != null && (typeof review_limit != 'number' || typeof review_limit == 'number' && (review_limit < 1 || review_limit%theme_columns > 0))) {
				if (jQuery('#theme-recommendation-bubble').is(':visible')) {
					jQuery('#theme-recommendation-bubble').slideUp(300);
				}
				
				if (jQuery('#theme-recommendation-columns').is(':hidden')) {
					jQuery('#theme-recommendation-columns').slideDown(300);
				}
			}
			else if (jQuery('#theme-recommendation-columns').is(':visible')) {
				jQuery('#theme-recommendation-columns').slideUp(300);
				
				if (jQuery(this).val().match(/\bbubble\b/i) != null && jQuery('#theme-recommendation-bubble').is(':hidden') && (typeof review_limit != 'number' || typeof review_limit == 'number' && review_limit >= 1)) {
					jQuery('#theme-recommendation-bubble').slideDown(300);
				}
			}
			else if (jQuery(this).val().match(/\bbubble\b/i) != null && jQuery('#theme-recommendation-bubble').is(':hidden') && (typeof review_limit != 'number' || typeof review_limit == 'number' && review_limit >= 1)) {
				jQuery('#theme-recommendation-bubble').slideDown(300);
			}
			else if ((jQuery(this).val().match(/\bbubble\b/i) == null || typeof review_limit == 'number' && review_limit < 1) && jQuery('#theme-recommendation-bubble').is(':visible')) {
				jQuery('#theme-recommendation-bubble').slideUp(300);
			}
			else if (jQuery('#theme-recommendation-narrow').is(':hidden') && (jQuery('#reviews-theme').val().match(/\bnarrow\b/i) != null && jQuery('#theme-recommendation-badge').is(':hidden') && jQuery('#theme-recommendation-bubble').is(':hidden'))) {
				jQuery('#theme-recommendation-narrow').slideDown(300);
			}
		
			if (jQuery(this).val().match(/\bdark\b/i) != null && !jQuery(this).closest('.section').hasClass('dark')) {
				jQuery(this).closest('.section').addClass('dark')
			}
			else if (jQuery(this).val().match(/\bdark\b/i) == null && jQuery(this).closest('.section').hasClass('dark')) {
				jQuery(this).closest('.section').removeClass('dark')
			}
			
			if (jQuery(this).val().match(/\bfonts\b/i) != null && !jQuery(this).closest('.section').hasClass('fonts')) {
				jQuery(this).closest('.section').addClass('fonts')
			}
			else if (jQuery(this).val().match(/\bfonts\b/i) == null && jQuery(this).closest('.section').hasClass('fonts')) {
				jQuery(this).closest('.section').removeClass('fonts')
			}
		});

		if (jQuery('#retrieval-sort', '#wpbody-content').length) {
			if (jQuery('#retrieval-sort').val().match(/^newest$/i) != null) {
				jQuery('#retrieval-sort-recommendation-newest').show();
			}
			else if (!jQuery('#retrieval-sort').val().length || jQuery('#retrieval-sort').val().match(/^(?:|both)$/i) != null) {
				jQuery('#retrieval-sort-recommendation-both').show();
			}

			jQuery('#retrieval-sort', '#wpbody-content').on('change blur', function() {
				if (jQuery(this).val().match(/^newest$/i) != null) {
					jQuery('#retrieval-sort-recommendation-both').slideUp(300);
					jQuery('#retrieval-sort-recommendation-newest').slideDown(300);
					return;
				}
				
				if (!jQuery(this).val().length || jQuery(this).val().match(/^(?:|both)$/i) != null) {
					jQuery('#retrieval-sort-recommendation-newest').slideUp(300);
					jQuery('#retrieval-sort-recommendation-both').slideDown(300);
					return;
				}
				
				jQuery('#retrieval-sort-recommendation-both').slideUp(300);
				jQuery('#retrieval-sort-recommendation-newest').slideUp(300);
				return;
			});
		}
		
		jQuery('#stylesheet-none, #stylesheet-compressed, #stylesheet-standard', '#wpbody-content').on('change', function() {
			if (jQuery('#stylesheet-none').is(':checked') && !jQuery('#reviews-theme', '#wpbody-content').is(':disabled')) {
				jQuery('#reviews-theme', '#wpbody-content').prop('disabled', true);
				return;
			}
			
			if (!jQuery('#stylesheet-none').is(':checked') && jQuery('#reviews-theme', '#wpbody-content').is(':disabled')) {
				jQuery('#reviews-theme', '#wpbody-content').prop('disabled', false).removeAttr('disabled');
				return;
			}
		});
		
		jQuery(':input', jQuery('#color-schemes', '#wpbody-content')).each(function() {
			jQuery(this).on('change', function() {
				jQuery(this).closest('label').addClass('selected').siblings('.selected').removeClass('selected');
			});
		});

		jQuery('#structured-data', '#wpbody-content').on('change', function() {
			jQuery('.structured-data', '#wpbody-content').each(function() {
				if (jQuery('#structured-data', '#wpbody-content').is(':checked')) {
					jQuery(this).show();
				}
				else {
					jQuery(this).hide();
				}
			});
			
			if (jQuery('#structured-data', '#wpbody-content').is(':checked')) {
				jQuery('#telephone', '#wpbody-content').focus();
			}
		});
		
		jQuery('#place-id', '#wpbody-content').on('keyup change', function() {
			if (jQuery('#places', '#wpbody-content').length && jQuery('#places', '#wpbody-content').is(':input:visible')) {
				if (jQuery(this).val().length && jQuery('#places', '#wpbody-content').is('select')) {
					if (jQuery(this).val().match(/^[\w.,_-]+$/i, '') && jQuery('#places option[value=' + jQuery(this).val() + ']', '#wpbody-content').length) {
						jQuery('#places', '#wpbody-content').val(jQuery(this).val());
						
						if (jQuery('#places option[value=new]', '#wpbody-content').length) {
							jQuery('#places option[value=new]', '#wpbody-content').remove();
						}
					}
					else if (!jQuery('#places option[value=new]', '#wpbody-content').length) {
						jQuery('#places option:eq(0)', '#wpbody-content').after('<option value="new">' + jQuery('#places', '#wpbody-content').data('new-place') + '</option>');
						jQuery('#places', '#wpbody-content').val('new');
					}
				}
				else {
					jQuery('#places', '#wpbody-content').val('');
					
					if (jQuery('#places option[value=new]', '#wpbody-content').length) {
						jQuery('#places option[value=new]', '#wpbody-content').remove();
					}
				}
			}
		});
		
		if (jQuery('#places', '#wpbody-content').length && jQuery('#places', '#wpbody-content').is('select:input')) {
			jQuery('#places', '#wpbody-content').on('change', function() {
				jQuery('#place-id', '#wpbody-content').val(jQuery(this).val());

				if (jQuery(this).val() != 'new' && jQuery('#places option[value=new]', '#wpbody-content').length) {
					jQuery('#places option[value=new]', '#wpbody-content').remove();
				}
			});
		}
		
		jQuery('a', '#reviews-rating-preview-heading').on('click', function (event) {
			event.preventDefault();
			
			if (jQuery('#reviews-rating-preview').hasClass('show')) {
				jQuery('#reviews-rating-preview').removeClass('show');
				jQuery('#reviews-rating-preview-heading').removeClass('active');
				jQuery('.dashicons', this).removeClass('dashicons-arrow-down').addClass('dashicons-arrow-right');
			}
			else {
				jQuery('#reviews-rating-preview').addClass('show');
				jQuery('#reviews-rating-preview-heading').addClass('active');
				jQuery('.dashicons', this).removeClass('dashicons-arrow-right').addClass('dashicons-arrow-down');
			}
		});
		
		jQuery('#structured-data-preview').on('click', function (event) {
			event.preventDefault();

			if (jQuery('#google-business-reviews-rating-overlay').length) {
				jQuery('#google-business-reviews-rating-overlay').remove();
			}
			
			jQuery('#structured-data-preview').after('<div id="google-business-reviews-rating-overlay"></div>');

			jQuery('#google-business-reviews-rating-overlay').on('click', function(event) {
				if (jQuery(event.target).attr('id') == 'google-business-reviews-rating-overlay') {
					jQuery(this).fadeOut(300, function() { jQuery(this).remove(); });
				}
			});
			
			jQuery('#google-business-reviews-rating-overlay').append('<div id="google-business-reviews-rating-close" class="close"><span class="dashicons dashicons-no" title="Close"></span></div><pre id="google-business-reviews-rating-structured-data"></pre>');

			jQuery('#google-business-reviews-rating-close').on('click', function() {
				jQuery('#google-business-reviews-rating-overlay').fadeOut(300, function() { jQuery('#google-business-reviews-rating-overlay').remove(); });
			});
			
			data = {
				action: 'google_business_reviews_rating_admin_ajax',
				type: 'structured_data',
				nonce: jQuery('#google-business-reviews-rating-setup').data('nonce')
			};
			
			if (jQuery('#logo').length) {
				data['logo'] = jQuery('#logo').val();
			}

			if (jQuery('#telephone').length) {
				data['telephone'] = jQuery('#telephone').val();
			}

			if (jQuery('#business-type').length) {
				data['business_type'] = jQuery('#business-type').val();
			}

			if (jQuery('#price-range').length) {
				data['price-range'] = jQuery('#price-range').val();
			}

			jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
				if (response.success) {
					jQuery('#google-business-reviews-rating-structured-data').html(response.data);
					google_business_reviews_rating_syntax_highlight(jQuery('#google-business-reviews-rating-structured-data'));
					return;
				}

				jQuery(this).fadeOut(300, function() { jQuery(this).remove(); });
			}, 'json');

		});
		if (jQuery('#review-sort').length) {
			jQuery('#review-sort').on('change', function() {
				if (!jQuery('#retrieval-sort').length) {
					return;
				}
	
				if (typeof jQuery(this).val() == 'string' && jQuery(this).val().match(/^date.*$/i) != null && jQuery('#retrieval-sort').val() == 'most_relevant') {
					jQuery('#retrieval-sort').val('review_sort');
					jQuery('#retrieval-sort-recommendation-both').slideUp(300);
					jQuery('#retrieval-sort-recommendation-newest').slideDown(300);
					return;
				}
	
				if ((!jQuery(this).val().length || typeof jQuery(this).val() == 'string' && jQuery(this).val().match(/^relevance.*$/i) != null) && jQuery('#retrieval-sort').val() == 'newest') {
					jQuery('#retrieval-sort').val('most_relevant');
					jQuery('#retrieval-sort-recommendation-both').slideUp(300);
					jQuery('#retrieval-sort-recommendation-newest').slideUp(300);
					return;
				}
			});
		}
		
		jQuery('#language, #welcome-language').on('change', function() {
			if (jQuery(this).val().length) {
				jQuery('#retrieval-translate, #welcome-retrieval-translate').prop('disabled', false).removeAttr('disabled').parent().removeClass('disabled');
			}
			else {
				jQuery('#retrieval-translate, #welcome-retrieval-translate').prop('checked', false).prop('disabled', true).parent().addClass('disabled');
			}
		});
		
		jQuery('a[href="#shortcodes"]', '#setup').on('click', function(event) {
			event.preventDefault();
			google_business_reviews_rating_tab(this);		
		});

		jQuery('a[href*="#"]', '#shortcodes').on('click', function(event) {
			event.preventDefault();
			if (jQuery(jQuery(this).attr('href'), '#shortcodes').length) {
				jQuery([document.documentElement, document.body]).animate({
					scrollTop: jQuery(jQuery(this).attr('href'), '#shortcodes').offset().top - 35
				}, 150);
			}
		});
		
		if (jQuery('.accepted', jQuery('#parameter-theme', '#shortcodes')).length && !jQuery('.accepted .hide', jQuery('#parameter-theme', '#shortcodes')).length) {
			jQuery('.accepted', jQuery('#parameter-theme', '#shortcodes')).html(jQuery('.accepted', jQuery('#parameter-theme', '#shortcodes')).html().replace(/^((?:(?:<span[^>]*>\w+<\/span>)?[^"&;]*)(?:(?:(?:&\w+;|")[^"&;]+(?:&\w+;|")[^"&;]+){8}))(.+)((?:&\w+;|")[^"&;]+(?:&\w+;|")[^"&;]*)$/i, '$1<a href="#parameter-theme" title="' + jQuery('#parameter-theme').data('show') + '"> … </a><span class="hide" style="display: none;">$2</span>$3'));
		}
		jQuery('.accepted > a:eq(0)', jQuery('#parameter-theme', '#shortcodes')).on('click', function(event) {
			event.preventDefault();
			jQuery(this).siblings('.hide').removeClass('hide').removeAttr('class').removeAttr('style');
			jQuery(this).remove();
		});
		
		jQuery('#styles-scripts-button').on('click', function () {
			existing_button = jQuery('#styles-scripts-button').html();
			jQuery('#styles-scripts-button').html('Saving&hellip;');
			data = {
				action: 'google_business_reviews_rating_admin_ajax',
				type: 'styles_scripts',
				stylesheet: (jQuery('#stylesheet-compressed').is(':checked')) ? 2 : ((jQuery('#stylesheet-none').is(':checked')) ? 0 : 1),
				javascript: (jQuery('#javascript-compressed').is(':checked')) ? 2 : ((jQuery('#javascript-none').is(':checked')) ? 0 : 1),
				custom_styles: jQuery('#custom-styles').val(),
				nonce: jQuery(this).closest('form').data('nonce')
			};

			jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
				if (response.success) {
					jQuery('#styles-scripts-button').html('Saved');
					setTimeout(function() { jQuery('#styles-scripts-button').html(existing_button); }, 1200);
					
					if (typeof response.message == 'string') {
						google_business_reviews_rating_message(response.message, 'success');
					}
				}
				else {
					if (typeof response.message == 'string') {
						google_business_reviews_rating_message(response.message, 'error');
					}
					
					jQuery('#styles-scripts-button').html('Retry');
				}
			}, 'json');
		});
		
		jQuery('tr', '#reviews-table').each(function(index) {
			if (jQuery('span', jQuery('.place-id', this)).length && jQuery('span:eq(0)', jQuery('.place-id', this)).data('place-name') && !jQuery('span:eq(0)', jQuery('.place-id', this)).hasClass('place-name')) {
				jQuery('span:eq(0)', jQuery('.place-id', this)).addClass('place-name')
				jQuery('.place-name', jQuery('.place-id', this)).on('click', function() {
					if (jQuery(this).siblings('.place-details').length) {
						jQuery(this).siblings('.place-details').fadeOut(300, function() { jQuery(this).remove(); });
					}
					else {
						if (jQuery('.place-details', '#reviews-table').length) {
							jQuery('.place-details', '#reviews-table').each(function(index) {
								jQuery(this).fadeOut(300, function() { jQuery(this).remove(); });
							});
						}
						var i = index;
						jQuery(this).after('<span class="place-details" style="display: none;"><span class="place-details-id">' + jQuery(this).attr('title') + '</span><span class="place-details-name">' + jQuery(this).data('place-name') + '</span></span>');
						jQuery(this).siblings('.place-details').fadeIn(300, function() {
							jQuery('.place-details-name', jQuery(this)).on('click', function() {
								jQuery(this).parent().fadeOut(300, function() { jQuery(this).remove(); });
							});
							setTimeout(function() {
								if (jQuery('.place-details', jQuery('tr:eq(' + i + ')', '#reviews-table')).length) {
									jQuery('.place-details', jQuery('tr:eq(' + i + ')', '#reviews-table')).fadeOut(300, function() { jQuery(this).remove(); });
								}
							}, 3500);
						});
					}
				});
			}
		});
				
		if (jQuery('#update, #welcome-update').length) {
			if (typeof update == 'number') {
				if (jQuery('#update').length && jQuery('#update').is(':visible')) {
					jQuery('#update').val(update);
				}
		
				if (jQuery('#welcome-update').length && jQuery('#welcome-update').is(':visible') && !jQuery('#welcome-update').val().length && jQuery('option[value="' + update.replace(/[^\w\s.,_-]/i, '') + '"]', '#update').length) {
					jQuery('#welcome-update').val(update);
				}
			}
		}

		jQuery('#google-credentials-help, #welcome-google-credentials-help').on('click', function(event) {
			event.preventDefault();
			if (jQuery(this).attr('id').match(/welcome/i) != null) {
				if (jQuery('#welcome-google-credentials-steps').is(':visible')) {
					jQuery('#welcome-google-credentials-steps').next('.visual-guide').slideUp(300, function() {
						jQuery('#welcome-google-credentials-steps').slideUp(300);
					});
				}
				else {
					jQuery('#welcome-google-credentials-steps').slideDown(300, function () {
						jQuery('#welcome-google-credentials-steps').next('.visual-guide').slideDown(300);
					});
				}
				
				return;
			}
			
			if (jQuery('#google-credentials-steps').is(':visible')) {
					jQuery('#google-credentials-steps').next('.visual-guide').slideUp(300, function() {
						jQuery('#google-credentials-steps').slideUp(300);
					});
			}
			else {
				jQuery('#google-credentials-steps').slideDown(300, function () {
					jQuery('#google-credentials-steps').next('.visual-guide').slideDown(300);
				});
			}
		});
		
		if (jQuery('#google-credentials-steps, #welcome-google-credentials-steps, #html-import-instructions').length) {
			jQuery('li', '#google-credentials-steps, #welcome-google-credentials-steps, #html-import-instructions').each(function() {
				jQuery(this).on('click', function() {
					jQuery(this).siblings('.active').removeClass('active');
					jQuery(this).addClass('active');
				});
			});
		}

		jQuery('#welcome-api-key, #welcome-place-id').on('focus keyup change blur', function (event) {
			if (jQuery(this).val().length >= 10 && jQuery(this).hasClass('error')) {
				jQuery(this).removeClass('error');
			}
			
			return;
		});
		
		jQuery('#welcome-save').on('click', function (event) {
			event.preventDefault();
			
			if (!jQuery('#welcome-api-key').length || !jQuery('#welcome-place-id').length) {
				return;
			}
			
			message = '';
			
			if (jQuery('#welcome-api-key').val().length < 10 && jQuery('#welcome-place-id').val().length < 10) {
				message = jQuery('#welcome').data('errors')[0];
				jQuery('#welcome-api-key, #welcome-place-id').addClass('error');
			}
			else if (jQuery('#welcome-api-key').val().length < 10) {
				message = jQuery('#welcome').data('errors')[1];
				jQuery('#welcome-api-key').addClass('error');
			}
			else if (jQuery('#welcome-place-id').val().length < 10) {
				message = jQuery('#welcome').data('errors')[2];
				jQuery('#welcome-place-id').addClass('error');
			}
			
			if (jQuery('#welcome-api-key').val().length >= 10 && jQuery('#welcome-api-key').val() == jQuery('#welcome-place-id').val()) {
				message = jQuery('#welcome').data('errors')[3];
				jQuery('#welcome-api-key, #welcome-place-id').addClass('error');
			}
			
			if (message.length || jQuery('#welcome-api-key').hasClass('error') || jQuery('#welcome-place-id').hasClass('error')) {
				google_business_reviews_rating_message(message, 'error');
				return;
			}
			
			data = {
				action: 'google_business_reviews_rating_admin_ajax',
				type: 'welcome',
				api_key: jQuery('#welcome-api-key').val(),
				place_id: jQuery('#welcome-place-id').val(),
				language: jQuery('#welcome-language').val(),
				retrieval_translate: jQuery('#welcome-retrieval-translate').is(':checked'),
				update: jQuery('#welcome-update').val(),
				nonce: jQuery(this).closest('form').data('nonce')
			};

			jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
				if (response.success) {
					document.location.href = document.location.href;
				}
				else {
					google_business_reviews_rating_message(jQuery('#welcome').data('errors')[4], 'error');
				}
			}, 'json');
		});
		
		jQuery('#welcome-demo').on('click', function (event) {
			event.preventDefault();
			data = {
				action: 'google_business_reviews_rating_admin_ajax',
				type: 'demo',
				nonce: jQuery(this).closest('form').data('nonce')
			};

			jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
				if (response.success) {
					document.location.href = document.location.href;
				}
				else {
					google_business_reviews_rating_message(jQuery('#welcome').data('errors')[4], 'error');
				}
			}, 'json');
		});
		
		jQuery('#clear-cache-button').on('click', function () {
			jQuery('#clear-cache-button').html('Clearing&hellip;');
			data = {
				action: 'google_business_reviews_rating_admin_ajax',
				type: 'clear_cache',
				nonce: jQuery(this).closest('form').data('nonce')
			};

			jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
				if (response.success) {
					jQuery('#clear-cache-button').html('Cleared');
					
					if (typeof response.message == 'string') {
						google_business_reviews_rating_message(response.message, 'success');
						setTimeout(function() { document.location.href = document.location.href.replace(location.hash, ''); }, 500);
					}
					else {
						setTimeout(function() { document.location.href = document.location.href.replace(location.hash, ''); }, 300);
					}
				}
				else {
					if (typeof response.message == 'string') {
						google_business_reviews_rating_message(response.message, 'error');
					}
					
					jQuery('#clear-cache-button').html('Retry Clear Cache');
				}
			}, 'json');
		});

		jQuery('#reset-button').on('click', function () {
			if (jQuery('#reset-confirm-text').is(':hidden')) {
				jQuery('#reset-confirm-text').slideDown(300);
			}
			else if (jQuery('#reset-confirm-text').is(':visible') && (jQuery('#reset-all').is(':checked') || jQuery('#reset-reviews').is(':checked'))) {
				data = {
					action: 'google_business_reviews_rating_admin_ajax',
					type: (jQuery('#reset-all').is(':checked')) ? 'reset' : 'reset_reviews',
					nonce: jQuery(this).closest('form').data('nonce')
				};

				jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
					if (response.success) {
						if (jQuery('#reset-all').is(':checked')) {
							jQuery('.nav-tab[href="#shortcodes"], .nav-tab[href="#reviews"], .nav-tab[href="#data"]', jQuery('nav:eq(0)', '#wpbody-content')).hide();
						}
						
						if (typeof response.message == 'string') {
							google_business_reviews_rating_message(response.message, 'success');

							setTimeout(function() {
								document.location.href = document.location.href.replace(location.hash, '');
							}, 500);
						}
						else {
							document.location.href = document.location.href.replace(location.hash, '');
						}
					}
					
					jQuery('#reset-all').prop('checked', false);
					jQuery('#reset-reviews').prop('checked', false);
				}, 'json');
			}
		});

		jQuery('.nav-tab', jQuery('nav:eq(0)', '#wpbody-content')).each(function(tab_index) {
			if (jQuery('.count', this).length && typeof jQuery('.count', this).text() == 'string' && jQuery('.count', this).text().match(/^\d{3,}$/i) != null) {
				jQuery('.count', this).attr('title', jQuery('.count', this).text()).addClass('more-than-99').text('99+');
			}

			jQuery(this).on('click', function (event) {
				event.preventDefault();
				google_business_reviews_rating_tab(this);				
			});
		});

		setTimeout(function() {
			window.scrollTo(0, 0);
			setTimeout(function() {
				window.scrollTo(0, 0);
				}, 100);
			}, 10);
	}
	
	if (jQuery('#rating-min').length && jQuery('#rating-max').length) {
		jQuery('#rating-min,#rating-max').on('change', function() {
			if (jQuery('#rating-min').val().length && jQuery('#rating-max').val().length && parseInt(jQuery('#rating-min').val()) > parseInt(jQuery('#rating-max').val())) {
				jQuery('#rating-min').val(jQuery('#rating-max').val());
			}
		});
	}
	
	if (jQuery('#review-text-min').length && jQuery('#review-text-max').length) {
		jQuery('#review-text-min,#review-text-max').on('change', function() {
			if (jQuery('#review-text-min').val().length && jQuery('#review-text-max').val().length && parseInt(jQuery('#review-text-min').val()) > parseInt(jQuery('#review-text-max').val())) {
				jQuery('#review-text-min').val(jQuery('#review-text-max').val());
			}
		});
	}
	
	if (jQuery('.review', '#reviews-table').length) {
		jQuery('.sort', jQuery('thead', '#reviews-table')).each(function() {
			jQuery(this).on('click', function(event) {
				event.preventDefault();
				google_business_reviews_rating_sort(this);
				return;
			});
		});
		
		jQuery('.review', '#reviews-table').each(function() {
			jQuery('.show-hide', jQuery('.id', this)).on('click', function(event) {
				event.preventDefault();
				google_business_reviews_rating_status(this);
				return;
			});
			
			jQuery('.remove', jQuery('.id', this)).on('click', function(event) {
				event.preventDefault();
				google_business_reviews_rating_remove(this);
				return;
			});
			
			jQuery('.date', jQuery('.submitted', this)).on('click', function(event) {
				if (jQuery(this).closest('.review').hasClass('estimate')) {
					event.preventDefault();
					jQuery(this).hide();
					jQuery(this).siblings('.time-estimate').show().focus();
				}
				return;
			});
			
			jQuery('.time-estimate', jQuery('.submitted', this)).on('change blur', function(event) {
				event.preventDefault();
				if (event.type == 'change' && jQuery(this).val().length) {
					google_business_reviews_rating_submitted(this);
					return;
				}
				
				jQuery(this).hide();
				jQuery(this).siblings('.date-edit').show();
				return;
			});

			jQuery('.language-edit:eq(0)', jQuery('.language:eq(0)', this)).on('click', function(event) {
				event.preventDefault();
				
				if (!jQuery('option', jQuery(this).siblings('select')).length) {
					languages = jQuery('#reviews-table').data('languages');
					
					jQuery(this).siblings('select').append('<option value="">' + jQuery(this).siblings('select').data('none') + '</option>');
					for (k in languages) {
						jQuery(this).siblings('select').append('<option value="' + k + '">' + languages[k] + '</option>');
					}
				}
				
				if (jQuery('.value:eq(0)', this).text().match(/^\w{2}l?(?:[_-]\w+)?$/)) {
					jQuery(this).siblings('select').val(jQuery('.value:eq(0)', this).text());
				}
				else {
					jQuery(this).siblings('select').val('');
				}
				
				jQuery(this).hide();
				jQuery(this).siblings('select').show().focus();
				return;
			});
			
			jQuery('select', jQuery('.language:eq(0)', this)).on('change blur', function(event) {
				event.preventDefault();
				if (event.type == 'change') {
					google_business_reviews_rating_language(this);
					return;
				}
				
				jQuery(this).hide();
				jQuery(this).siblings('.language-edit').show();
				return;
			});
		});
	}
	
	if (jQuery('li', '#advanced .entry-content').length && jQuery('#html-import-figure-1').length) {
		
		jQuery('li:eq(2)', '#advanced .entry-content').on('mouseover mouseout', function(event) {
			if (event.type == 'mouseover') {
				jQuery('img', '#html-import-figure-1, #html-import-figure-2').css('box-shadow', '0 0 0 3px #008ec2');
			}
			else {
				jQuery('img', '#html-import-figure-1, #html-import-figure-2').removeAttr('style');
			}
		});
		
		jQuery('li:eq(3)', '#advanced .entry-content').on('mouseover mouseout', function(event) {
			if (event.type == 'mouseover') {
				jQuery('img', '#html-import-figure-3').css('box-shadow', '0 0 0 3px #008ec2');
			}
			else {
				jQuery('img', '#html-import-figure-3').removeAttr('style');
			}
		});
	}
	
	jQuery('.right-click').each(function() {
		if (typeof navigator != 'undefined' && typeof navigator.appVersion == 'string' && navigator.appVersion.match(/i(?:phone|pod|pad)|android|blackberry|webos/i) != null) {
			jQuery(this).text(((jQuery(this).text().match(/^[A-Z]/) != null) ? 'P' : 'p') + 'ress and hold')
		}
		else if (typeof navigator != 'undefined' && typeof navigator.appVersion == 'string' && navigator.appVersion.indexOf('Mac') >= 0) {
			jQuery(this).text(((jQuery(this).text().match(/^[A-Z]/) != null) ? 'C' : 'c') + 'ommand click')
		}
	});
	
	jQuery('#import-button').on('click', function() {
		if (jQuery(this).is(':disabled') || jQuery(this).is(':hidden') || !jQuery('.review', '#reviews-import-table').length) {
			return;
		}
		
		i = 0;
		data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: 'import',
			import_type: (jQuery('#html-import-review-text').length && jQuery('#html-import-review-text').val().length) ? jQuery('#html-import-review-text').val() : null,
			order: jQuery('#reviews-import-table').data('order'),
			nonce: jQuery('#google-business-reviews-rating-settings-html-import').data('nonce'),
			reviews: []
		};

		jQuery('.review', '#reviews-import-table').each(function() {
			if (!jQuery(this).hasClass('existing') && jQuery(':input:checkbox:checked', this).length && typeof jQuery(this).data('review') != 'undefined') {
				review = jQuery(this).data('review');
				review.time = jQuery('.date :input:eq(0)', this).val();
				review.language = jQuery('.language :input:eq(0)', this).val();
				data.reviews.push(review);
			}
		});
		
		jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
			if (response.success) {
				google_business_reviews_rating_message(response.message, 'success');
				jQuery('#html-import-input, #html-import-output').remove();
				jQuery('#advanced').removeClass('import-results');
				jQuery('#import-button, #import-clear-button').hide();
				jQuery('#import-process-button, #html-import, #advanced > form > .introduction, #google-business-reviews-rating-settings-styles-scripts, #google-business-reviews-rating-settings-cache, #google-business-reviews-rating-settings-reset').show();
				jQuery('#html-import').val('');
				reviews = [];
				window.scrollTo(0, 0);
				
				setTimeout(function() {
					section = 'reviews';
					jQuery('a[href="#advanced"]', '.nav-tab-wrapper:eq(0)').removeClass('nav-tab-active');
					jQuery('a[href="#' + section + '"]', '.nav-tab-wrapper:eq(0)').removeClass('nav-tab-active');
					jQuery('#advanced', '#google-business-reviews-rating-settings').hide();
					jQuery('#' + section, '#google-business-reviews-rating-settings').show();
					jQuery('#reviews-table', '#google-business-reviews-rating-settings').css('opacity', 0.4);
					jQuery('#reviews-table', '#google-business-reviews-rating-settings').append('		<tr id="temp-row">\n			<td class="full-width" colspan="' + jQuery('th, td', jQuery('#reviews-table tr:eq(0)', '#google-business-reviews-rating-settings')).length + '">&hellip;</td>\n		</tr>');

					setTimeout(function() {
						window.location.hash = '#' + section;
						window.scrollTo(0, 0);
						window.location.reload(true);
					}, 1900);
				}, 100);
			}
			else {
				google_business_reviews_rating_message(response.message, 'error');
				jQuery('#html-import-input, #html-import-output').remove();
				jQuery('#advanced').removeClass('import-results');
				jQuery('#import-button, #import-clear-button').hide();
				jQuery('#import-process-button, #html-import, #advanced > form > .introduction, #google-business-reviews-rating-settings-styles-scripts, #google-business-reviews-rating-settings-cache, #google-business-reviews-rating-settings-reset').show();
				jQuery('#html-import').val('');
				reviews = [];
			}
		}, 'json');
		return;

	});
	
	jQuery('.void').each(function() {
		jQuery(this).on('click', function(event) {
			event.preventDefault();
		});
	});
	
	jQuery('.highlight').each(function() {
		jQuery(this).on('click', function() {
			if (jQuery(this).text().match(/^[0-9a-f][0-9a-f:.-]{7,80}$/) == null) {
				return;
			}
			
			if (window.getSelection && document.createRange) {
				selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(this);
				selection.removeAllRanges();
				selection.addRange(range);
				return;
			}
			
			if (document.selection && document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(this);
				range.select();
				return;
			}
		});
	});
	
	if (jQuery('#html-import').length) {
		jQuery('#import-clear-button').on('click', function(event) {
			jQuery('#html-import-input, #html-import-output').remove();
			jQuery('#advanced').removeClass('import-results');
			jQuery('#import-button, #import-clear-button').hide();
			jQuery('#import-process-button, #html-import, #html-import-review-text, #html-import-empty-label, #html-import-existing-label, #advanced > form > .introduction, #google-business-reviews-rating-settings-styles-scripts, #google-business-reviews-rating-settings-cache, #google-business-reviews-rating-settings-reset').show();
			jQuery('#html-import').val('');
			reviews = [];
		});
		
		jQuery('#html-import, #import-process-button').on('change blur click', function(event) {
			jQuery('#html-import').removeClass('error').removeClass('valid');
			
			if (!jQuery('#html-import').val().length || jQuery(this).is('#html-import') && event.type == 'click' || jQuery(this).is('#import-process-button') && event.type != 'click') {
				return;
			}
			
			html = jQuery('#html-import').val();
			order = [];
			any_translated = false;
			empty_reviews = 0;
			
			if (!jQuery('#html-import-input').length) {
				jQuery('#html-import-empty-label, #html-import-existing-label').after('<div id="html-import-input" style="display: none;"></div>');
			}
			
			jQuery.parseHTML(html, null, false);
			document.getElementById('html-import-input').innerHTML = html;
			e = (jQuery('.Svr5cf', '#html-import-input').length) ? ((jQuery('.Svr5cf[jslog]', '#html-import-input').length) ? jQuery('.Svr5cf[jslog]', '#html-import-input') : jQuery('.Svr5cf', '#html-import-input')) : ((jQuery('.WMbnJf', '#html-import-input').length) ? jQuery('.WMbnJf', '#html-import-input') : null);

			if (e != null) {
				if (jQuery(this).is('#html-import')) {
					jQuery('#html-import').addClass('valid');
					return;
				}
				
				if (typeof jQuery('a:eq(0)', '#html-import-input').data('pid') == 'string' && jQuery('a:eq(0)', '#html-import-input').data('pid').length && jQuery('a:eq(0)', '#html-import-input').data('pid') != jQuery('#place-id').val()) {
					jQuery('#html-import').removeClass('valid').addClass('error');
					google_business_reviews_rating_message('Imported reviews do not match current Place ID', 'error');
					return;
				}
				
				jQuery('#import-process-button, #html-import, #html-import-review-text, #html-import-empty-label, #html-import-existing-label, #advanced > form > .introduction, #google-business-reviews-rating-settings-styles-scripts, #google-business-reviews-rating-settings-cache, #google-business-reviews-rating-settings-reset').hide();
				jQuery('#html-import').addClass('valid');
				jQuery('#advanced').addClass('import-results');
				
				jQuery(e).each(function() {
					if (jQuery(this).hasClass('Svr5cf') && (!jQuery('.lgjfz', this).length || jQuery('.lgjfz:eq(0)', this).length && jQuery('.lgjfz:eq(0)', this).attr('src').match(/^.+branding.+google.+$/i) == null)) {
						return;
					}

					if (jQuery('.JRGY0', this).length) {
						jQuery('.JRGY0', this).remove();
					}

					translated = false;
					base_language = true;
					text = jQuery(this).hasClass('Svr5cf') ? jQuery('.OlkcBc', this).length > 1 && jQuery('span', jQuery('.OlkcBc:eq(1)', this)).length && jQuery('span', jQuery('.OlkcBc:eq(1)', this)).text().length ? jQuery('.K7oBsc:eq(0)', jQuery('.OlkcBc:eq(1)', this)).text() : jQuery('.K7oBsc', this).length && jQuery('span', jQuery('.K7oBsc', this)).length && jQuery('span', jQuery('.K7oBsc', this)).text().length ? jQuery('span', jQuery('.K7oBsc', this)).text() : null : jQuery('.Jtu6Td', this).length && jQuery('.Jtu6Td > span > span', this).length ? jQuery('.Jtu6Td:eq(0) .review-full-text:eq(0)', this).length && jQuery('.Jtu6Td:eq(0) .review-full-text', this).text().length ? jQuery('.Jtu6Td:eq(0) .review-full-text:eq(0)', this).html() : jQuery('.Jtu6Td > span:eq(0) > span:eq(0)', this).html() : jQuery('.review-full-text', this).length && typeof jQuery('div:eq(0) > div:eq(2) .review-full-text:eq(0)', this).html() == 'string' ? jQuery('div:eq(0) > div:eq(2) .review-full-text:eq(0)', this).html() : typeof jQuery('div:eq(0) > div:eq(2) > div:eq(1) > span:eq(0)', this).html() == 'string' ? jQuery('div:eq(0) > div:eq(2) > div:eq(1) > span:eq(0)', this).html() : typeof jQuery('div:eq(0) > div:eq(3) > div:eq(1) > span:eq(0)', this).html() == 'string' ? jQuery('.review-full-text', this).length ? jQuery('div:eq(0) > div:eq(3) > div:eq(1) .review-full-text:eq(0)', this).html() : jQuery('div:eq(0) > div:eq(3) > div:eq(1) > span:eq(0)', this).html() : null;
					var text_original = text;

					switch (jQuery('#html-import-review-text').val()) {
					case 'translation':
						if (text == null || !text.length) {
							break;
						}
						
						if (jQuery('.DHIhE', this).length) {
							if (!text.match(/^\((?:[^()]{3,40}Google|Google[^()]{3,40}|[^()]{3,40}Google[^()]{3,40})\)\s*[^(]+\([^()]{3,40}\)\s*.+$/)) {
								break;
							}
							
							text = text.replace(/^\((?:[^()]{3,40}Google|Google[^()]{3,40}|[^()]{3,40}Google[^()]{3,40})\)\s*([^(]+)\([^()]{3,40}\)\s*(.+)$/, '$1');
							translated = true;
							break;
						}
						
						if (!text.match(/^\s*\([^)]{4,100}\)\s*.+$/)) {
							if (!text.match(/^.+\s*\((?:[^()]{3,40}Google|Google[^()]{3,40}|[^()]{3,40}Google[^()]{3,40})\)\s*.+$/)) {
								break;
							}
							text = text.replace(/^\s*(?:.+)\s*(?:<br\s?\/?>\s*){2,3}\([^)]{4,100}\)\s*(?:<br\s?\/?>\s*){1,3}(.+)$/, '$1');
							translated = true;
							break;
						}
						
						text = text.replace(/^\s*\([^)]{4,100}\)\s+(.+)\s*(?:<br\s?\/?>\s*){2,3}\([^)]{4,100}\)\s*(?:<br\s?\/?>\s*){1,3}(.+)$/, '$1');
						translated = true;
						break;
					case 'original':
						if (text == null || !text.length) {
							break;
						}
						
						if (jQuery('.DHIhE', this).length) {
							if (!text.match(/^\((?:[^()]{3,40}Google|Google[^()]{3,40}|[^()]{3,40}Google[^()]{3,40})\)\s*[^(]+\([^()]{3,40}\)\s*.+$/)) {
								break;
							}
							
							text = text.replace(/^\((?:[^()]{3,40}Google|Google[^()]{3,40}|[^()]{3,40}Google[^()]{3,40})\)\s*([^(]+)\([^()]{3,40}\)\s*(.+)$/, '$2');
							base_language = false;
							break;
						}
						
						if (!text.match(/^\s*\([^)]{4,100}\)\s*.+$/)) {
							if (!text.match(/^.+\s*\((?:[^()]{3,40}Google|Google[^()]{3,40}|[^()]{3,40}Google[^()]{3,40})\)\s*.+$/)) {
								break;
							}
							text = text.replace(/^\s*(.+)\s*(?:<br\s?\/?>\s*){2,3}\([^)]{4,100}\)\s*(?:<br\s?\/?>\s*){1,3}(.+)$/, '$1');
							base_language = false;
							break;
						}
						
						text = text.replace(/^\s*\([^)]{4,100}\)\s+(.+)\s*(?:<br\s?\/?>\s*){2,3}\([^)]{4,100}\)\s*(?:<br\s?\/?>\s*){1,3}(.+)$/, '$2');
						base_language = false;
						break;
					default:
						break;
					}

					if ((text == null || !text.length)) {
						empty_reviews++;

						if (!jQuery('#html-import-empty').is(':checked')) {
							return;
						}
					}

					any_translated = (any_translated || translated);
					
					if (jQuery(this).hasClass('WMbnJf')) {
						if (jQuery('div:eq(0) > div:eq(3) > div:eq(0) > .lTi8oc > span[aria-label]:eq(0)', this).length) {
							var author_name = (typeof jQuery('div:eq(0) a:eq(0)', this).text() == 'string') ? jQuery('div:eq(0) a:eq(0)', this).text() : null;
							reviews.push({
								author_name: (typeof jQuery('div:eq(0) a:eq(0)', this).text() == 'string') ? jQuery('div:eq(0) a:eq(0)', this).text() : null,
								author_url: (typeof jQuery('div:eq(0) a:eq(0)', this).attr('href') == 'string') ? jQuery('div:eq(0) a:eq(0)', this).attr('href') : null,
								profile_photo_url: (typeof jQuery('img:eq(0)', this).attr('src') == 'string') ? jQuery('img:eq(0)', this).attr('src').replace(/=s(?:40|64)/, '=s128') : null,
								rating: parseInt(jQuery('div:eq(0) > div:eq(3) > div:eq(0) > .lTi8oc > span[aria-label]:eq(0)', this).attr('aria-label').replace(/^[^\d]+(\d+).*$/i, '$1')),
								relative_time_description: (jQuery('div:eq(0) > div:eq(3) > div:eq(0) > span:eq(0)', this).length) ? jQuery('div:eq(0) > div:eq(3) > div:eq(0) > span:eq(0)', this).text() : null,
								text: text,
								translated: translated,
								base_language: base_language,
								time: null
							});
							return;
						}

						reviews.push({
							author_name: (typeof jQuery('div:eq(0) a:eq(0)', this).text() == 'string') ? jQuery('div:eq(0) a:eq(0)', this).text() : null,
							author_url: (typeof jQuery('div:eq(0) a:eq(0)', this).attr('href') == 'string') ? jQuery('div:eq(0) a:eq(0)', this).attr('href') : null,
							profile_photo_url: (typeof jQuery('img:eq(0)', this).attr('src') == 'string') ? jQuery('img:eq(0)', this).attr('src').replace(/=s(?:40|64)/, '=s128') : null,
							rating: (jQuery('.pjemBf:eq(0)', this).length && jQuery('.pjemBf:eq(0)', this).text().match(/^\s*(\d).+$/i) != null) ? parseInt(jQuery('.pjemBf:eq(0)', this).text().replace(/^\s*(\d).+$/i, '$1')) : ((jQuery('.PuaHbe', this).length && jQuery('.PuaHbe > span', this).length && typeof jQuery('.PuaHbe > span:eq(0)', this).attr('aria-label') == 'string') ? parseInt(jQuery('.PuaHbe > span:eq(0)', this).attr('aria-label').replace(/^[^\d]*(\d).*$/i, '$1')) : ((typeof jQuery('div:eq(0) > div:eq(2) span:eq(0)', this).attr('aria-label') == 'string') ? (Math.round(parseFloat(jQuery('div:eq(0) > div:eq(2) span:eq(0)', this).attr('aria-label').replace(/^[^\d]*(\d+(?:\.\d+)?).*$/, '$1'))*10)*0.1) : null)),
							relative_time_description: (jQuery('.Qhbkge:eq(0)', jQuery('div:eq(0)', this)).length && jQuery('.Qhbkge:eq(0)', jQuery('div:eq(0)', this)).text().match(/^(.+[^\s]+)\s+\w+\s+(?:Google)$/i)) ? jQuery('.Qhbkge:eq(0)', jQuery('div:eq(0)', this)).text().replace(/^(.+[^\s]+)\s+\w+\s+(?:Google)$/i, '$1') : ((jQuery('.PuaHbe', this).length && jQuery('.PuaHbe > span:eq(1)', this).length && jQuery('.PuaHbe > span:eq(1)', this).text().length) ? jQuery('.PuaHbe > span:eq(1)', this).text() : ((typeof jQuery('div:eq(0) > div:eq(2) span:eq(2)', this).text() == 'string') ? jQuery('div:eq(0) > div:eq(2) span:eq(2)', this).text() : null)),
							text: text,
							translated: translated,
							base_language: base_language,
							time: null
						});
						return;
					}
					
					reviews.push({
						author_name: (jQuery('.DHIhE', this).length && typeof jQuery('.DHIhE:eq(0)', this).text().length) ? jQuery('.DHIhE:eq(0)', this).text() : ((jQuery('.faBUBf', this).length && typeof jQuery('.faBUBf:eq(0)', this).text().length) ? jQuery('.faBUBf:eq(0)', this).text() : null),
						author_url: (jQuery('.AMrStc', this).length && typeof jQuery('.AMrStc:eq(0)', this).attr('href') == 'string') ? jQuery('.AMrStc:eq(0)', this).attr('href') : null,
						profile_photo_url: (jQuery('.ZCWdM', this).length && typeof jQuery('.ZCWdM:eq(0)', this).attr('src') == 'string') ? ((jQuery('.ZCWdM:eq(0)', this).attr('srcset') == 'string' && jQuery('.ZCWdM:eq(0)', this).attr('srcset').match(/^(?:.+,\s+)([^\s]+)[\dx\s.]+$/)) ? jQuery('.ZCWdM:eq(0)', this).attr('srcset').replace(/^(?:.+,\s+)([^\s]+)[\dx\s.]+$/,'$1') : jQuery('.ZCWdM:eq(0)', this).attr('src')) : null,
						rating: (jQuery('.MfbzKb:eq(0)', this).length && jQuery('.MfbzKb:eq(0)', this).text().match(/^\s*(\d).+$/i) != null) ? parseInt(jQuery('.MfbzKb:eq(0)', this).text().replace(/^\s*(\d).+$/i, '$1')) : ((jQuery('.KdvmLc', this).length && jQuery('.KdvmLc:eq(0)', this).text().match(/^(\d+(?:\.\d+)?)\/(3|5|10|20|100)$/)) ? (Math.round(parseFloat(jQuery('.KdvmLc:eq(0)', this).text().replace(/^(\d+(?:\.\d+)?)\/(3|5|10|20|100)$/, '$1')) / parseFloat(jQuery('.KdvmLc:eq(0)', this).text().replace(/^(\d+(?:\.\d+)?)\/(3|5|10|20|100)$/, '$2'))*50)*0.1) : ((jQuery('.GDWaad', this).length && jQuery('.GDWaad:eq(0)', this).text().match(/^(\d+(?:\.\d+)?)\/(3|5|10|20|100)$/)) ? (Math.round(parseFloat(jQuery('.GDWaad:eq(0)', this).text().replace(/^(\d+(?:\.\d+)?)\/(3|5|10|20|100)$/, '$1')) / parseFloat(jQuery('.GDWaad:eq(0)', this).text().replace(/^(\d+(?:\.\d+)?)\/(3|5|10|20|100)$/, '$2'))*50)*0.1) : null)),
						relative_time_description: (jQuery('.iUtr1', this).length && jQuery('.iUtr1:eq(0)', this).html().match(/^([\d\w\s]+[\d\w]+)\s+[^\s]+\s+<.+$/i)) ? jQuery('.iUtr1:eq(0)', this).html().replace(/^([\d\w\s]+[\d\w]+)\s+[^\s]+\s+<.+$/i, '$1') : null,
						text: text,
						translated: translated,
						base_language: base_language,
						time: null
					});
				});
				
				if (reviews.length) {
					jQuery('#reviews-import-table').remove();
					jQuery('#html-import-input').after('<div id="html-import-output"><table id="reviews-import-table" class="wp-list-table widefat striped reviews-table" data-order=""><thead></thead><tbody></tbody></table></div>');
					row = '<tr>\n'
						+ '<td id="cb" class="manage-column column-cb check-column"><label class="screen-reader-text" for="review-import-select-all">Select all</label><input id="review-import-select-all" type="checkbox" checked="checked"></td>\n'
						+ '<th class="author">Name</th>\n'
						+ '<th class="rating">Rating</th>\n'
						+ '<th class="text">Review</th>\n'
						+ ((any_translated && jQuery('#html-import-review-text').val() == 'translation') ? '<th class="translated">Translated</th>\n' : '')
						+ '<th class="language">Language</th>\n'
						+ '<th class="relative-time-description date">Relative Date</th>\n'
						+ '<th class="submitted date" title="Approximate Submitted Date">Approx. Date</th>\n'
						+ '</tr>\n';
					jQuery('thead', '#reviews-import-table').append(row);
					
					jQuery('#review-import-select-all').on('click', function() {
						jQuery('.review', '#reviews-import-table').each(function() {
							jQuery(':input:checkbox', this).prop('checked', !jQuery(':input:checkbox', this).is(':checked'));
						});
					});
					
					existing_show = jQuery('#html-import-existing').is(':checked');
					relative_times = jQuery('#html-import').data('relative-times');
					languages = jQuery('#html-import').data('languages');
					today_string = new Date().toISOString().split('T')[0];
					count = 0;

					for (j = 0; j < 2; j++) {
						for (i in reviews) {
							review = reviews[i];
							existing = false;
							date_actual = null;
							
							if (!existing) {
								jQuery('.review', '#reviews-table').each(function() {
									if (!existing) {
										if (jQuery('.author:eq(0) > .name', this).text() == review.author_name && jQuery('.author:eq(0) > .name a:eq(0)', this).attr('href').replace(/^.+\/(\d{20,120}).*$/, '$1') == review.author_url.replace(/^.+\/(\d{20,120}).*$/, '$1')) {
											existing = true;
											date_actual = jQuery('.submitted', this).text();
										}
									}
								});
							}
							
							reviews[i].existing = existing;	
							
							if (!existing && j == 0 || existing_show && existing && j == 1) {
								date_temp = null;
								time_unit = (review.relative_time_description.match(/^([\d]{1,3})\s+[^\s]+\s+\w+/i) != null) ? parseInt(review.relative_time_description.replace(/^.*(\d{1,3}).*$/i, '$1')) : 1;
								language = (typeof review.author_url == 'string' && (review.author_url.toLowerCase().replace(/^(?:[^?]+)\?(?:hl=([0-9a-z]+)[0-9a-z-]*).+$/i, '$1') in languages)) ? review.author_url.toLowerCase().replace(/^(?:[^?]+)\?(?:hl=([0-9a-z]+)[0-9a-z-]*).+$/i, '$1') : null;
								
								for (k in relative_times) {
									regex = new RegExp('^' + relative_times[k].text.replace(/%u/g, '\\d+').replace(/ /g, '\\s+') + '$', 'i');
									
									if (review.relative_time_description.match(regex)) {
										date_temp = new Date();
										if (relative_times[k].singular) {
											date_temp.setDate(date_temp.getDate() - Math.round(Math.round((relative_times[k].min_time + relative_times[k].max_time) * 0.5) / 86400));
										}
										else {
											date_temp.setDate(date_temp.getDate() - Math.round((relative_times[k].divider * time_unit) / 86400));
										}
										
										break;
									}
								}
								
								if (date_temp == null && language != null && language.match(/^(?:de|es|fr|it|nl|pl).*$/i) != null) {
									time_unit = (review.relative_time_description.match(/^(?:[^\d]*)(\d{1,3})(?:[^\d]*)$/i)) ? parseInt(review.relative_time_description.replace(/^(?:[^\d]*)(\d{1,3})(?:[^\d]*)$/i, '$1')) : 1;
									
									for (k in relative_times) {
										if (date_temp == null && (relative_times[k].singular && time_unit == 1 || !relative_times[k].singular && time_unit != 1)) {
											switch (k) {
											case 'hour':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+(?:1|une)\s+heure$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+(?:1|einer)\s+Stunde$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+(?:1|una)\s+hora$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^(?:1|un)[\s\'’]+ora\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^net\s+nu$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^(?:teraz|1\s+godzin[ay]?\s+temu)$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'hours':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+\d+\s+heures$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+\d+\s+Stunden$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+\d+\s+horas$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^\d+\s+ore\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^\d+\s+uur\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^\d+\s+godzin[ay]?\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'day':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+(?:1|un)\s+jour$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+(?:1|einem)\s+Tag$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+(?:1|un)\s+día$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^(?:1|un)\s+giorno\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^een\s+dag\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^dzień\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'days':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+\d+\s+jours$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+\d+\s+Tagen$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+\d+\s+días$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^\d+\s+giorni\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^\d+\s+dagen\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^\d+\s+dni\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'within_week':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^la\s+semaine\s+dernière$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^in\s+der\s+letzten\s+Woche$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^en\s+la\s+ultima\s+semana$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^nell[\s\'’]+ultima\s+settimana$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^in\s+de\s+afgelopen\s+week$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^w\s+ostatnim\s+tygodniu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'week':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+(?:1|une)\s+semaine$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+(?:1|einer)\s+Woche$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+(?:1|una)\s+semana$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^(?:1|una)\s+settimana\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^een\s+week\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^tydzień\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'weeks':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+\d+\s+semaines$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+\d+\s+Wochen$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+\d+\s+semanas$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^\d+\s+settimane\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^\d+\s+weken\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^\d+\s+tygodni\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'month':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+(?:1|un)\s+mois$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+(?:1|einem)\s+Monat$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+(?:1|un)\s+mes$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^(?:1|un)\s+mese\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^een\s+maand\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^miesiąc\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'months':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+\d+\s+mois$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+\d+\s+Monaten$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+\d+\s+meses$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^\d+\s+mesi\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^\d+\s+maanden\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^\d+\s+miesi[ąę]c[ey](?:\s+temu)?$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'year':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+(?:1|un)\s+an$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+(?:1|einem)\s+Jahr$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+(?:1|una?)\s+año$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^(?:1|un)\s+anno\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^een\s+jaar\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^rok\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											case 'years':
												if (language != null && (
													language.match(/^fr/i) && review.relative_time_description.match(/^il\s+y\s+a\s+\d+\s+ans$/i) ||
													language.match(/^de/i) && review.relative_time_description.match(/^vor\s+\d+\s+Jahren$/i) ||
													language.match(/^es/i) && review.relative_time_description.match(/^hace\s+\d+\s+años$/i) ||
													language.match(/^it/i) && review.relative_time_description.match(/^\d+\s+anni\s+fa$/i) ||
													language.match(/^nl/i) && review.relative_time_description.match(/^\d+\s+jaar\s+geleden$/i) ||
													language.match(/^pl/i) && review.relative_time_description.match(/^\d+\s+lat[a]?\s+temu$/i)
													)) {
													date_temp = true;
													break;
												}
												break;
											}
											
											if (typeof date_temp == 'boolean' && date_temp) {
												date_temp = new Date();
												
												if (relative_times[k].singular) {
													date_temp.setDate(date_temp.getDate() - Math.round(Math.round((relative_times[k].min_time + relative_times[k].max_time) * 0.5) / 86400));
													break;
												}
												
												date_temp.setDate(date_temp.getDate() - Math.round((relative_times[k].divider * time_unit) / 86400));
												break;
											}
										}
									}
								}

								date_estimate = (date_temp != null) ? date_temp.getFullYear() + '-' + ((date_temp.getMonth() < 9) ? '0' + String(date_temp.getMonth() + 1) : (date_temp.getMonth() + 1)) + '-' + ((date_temp.getDate() < 10) ? '0' + String(date_temp.getDate()) : date_temp.getDate()) : '';
								
								row = '<tr id="review-import-' + (parseInt(i) + 1) + '" class="review rating-' + review.rating + ((existing) ? ' existing' : ((date_estimate == '') ? ' error' : '')) + '">\n'
									+ '<td class="check-column" scope="row">' + ((!existing) ? '<label class="screen-reader-text" for="review-import-cb-' + (parseInt(i) + 1) + '">Select</label><input id="review-import-cb-' + (parseInt(i) + 1) + '" type="checkbox" checked="checked">' : '&nbsp;') + '</td>\n'
									+ '<td class="author"><span class="name"><a href="' + review.author_url + '" target="_blank">' + review.author_name + '</a></span> <span class="avatar"><a href="' + review.author_url + '" target="_blank"><img src="' + review.profile_photo_url + '" alt="Avatar"></a></span></td>\n'
									+ '<td class="rating">' + String('★').repeat(parseInt(review.rating)) + ((parseInt(review.rating) < 5) ? '<span class="not">' + String('☆').repeat(5 - parseInt(review.rating)) + '</span>' : '') + ' <span class="rating-number">(' + parseInt(review.rating) + ')</span></td>\n'
									+ '<td class="text"><div class="text-wrap">' + ((review.text != null && review.text.length) ? review.text : '<span class="none" title="None">—</span>') + '</div></td>\n'
									+ ((any_translated && jQuery('#html-import-review-text').val() == 'translation') ? '<td class="translated">' +  ((review.text != null && review.text.length) ? ((review.translated) ? '<span class="dashicons dashicons-yes" title="Translated"></span>' : '<span class="dashicons dashicons-no" title="Original"></span>') : '<span class="none" title="None">—</span>') + '</td>\n' : '')
									+ '<td class="language">';

								if (!existing && review.text != null && review.text.length) {
									row += '<select id="review-language-' + (parseInt(i) + 1) + '" name="review-language[]">\n'
										+ '<option value="" selected>None</option>\n';

									for (k in languages) {
										row += '<option value="' + k + '">' + languages[k] + '</option>\n';
									}

									row += '</select>\n';
								}
								else {
									row += '<span class="none" title="None">—</span>';
								}

								row += '</td>\n'
									+ '<td class="relative-time-description date">' + review.relative_time_description + '</td>\n'
									+ '<td class="submitted date">' + ((!existing) ? '<input type="date" id="review-import-date-' + (parseInt(i) + 1) + '" name="review-import-date[]" value="' + date_estimate + '" title="Approximate Submitted Date" max="' + today_string + '">' : '<span title="Submitted Date">' + date_actual + '</span>') + '</td>\n'
									+ '</tr>\n';
								jQuery('tbody', '#reviews-import-table').append(row);
								
								if (!existing) {
									if (review.text != null && review.text.length && jQuery('#review-language-' + (parseInt(i) + 1)).length) {
										if ((!review.translated || review.translated && jQuery('#html-import-review-text').val() == 'translation') && review.base_language && language != null) {
											jQuery('#review-language-' + (parseInt(i) + 1)).val(language);
										}
									}
									
									count++;
								}
							}
						}
					}
					
					if (count > 0) {
						for (i in reviews) {
							if (typeof reviews[i].author_url == 'string') {
								order.push(reviews[i].author_url.replace(/^([^?]+).*$/, '$1'));
							}
							
							if (!reviews[i].existing) {
								jQuery('#review-import-' + (parseInt(i) + 1)).data('review', reviews[i]);
							}
						}
					}
				}
				
				if (count > 0) {
					jQuery('#reviews-import-table, #import-button, #import-clear-button').show();
					if (count > 20) {
						jQuery('#html-import-output').prepend('<p>Found ' + count + ' new reviews' + ((empty_reviews > 0) ? '; ' + ((jQuery('#html-import-empty').is(':checked')) ? 'including' : 'discounting') + ' ' + ((empty_reviews > 1) ? empty_reviews + ' empty reviews' : 'one empty review') : '') + '.</p>');
					}
					else if (!jQuery('#html-import-empty').is(':checked') && empty_reviews > 0) {
						jQuery('#html-import-output').prepend('<p>' + ((count > 0) ? 'Found ' + ((count > 1) ? count + ' new reviews' : 'one review') : 'No reviews found') + '; excluding ' + ((empty_reviews > 1) ? empty_reviews + ' empty reviews' : 'one empty review') + '.</p>');
					}
					
					jQuery('#reviews-import-table').data('order', order);

					jQuery(':input', '#reviews-import-table').each(function() {
						jQuery(this).on('change', function() {
							if (jQuery(this).is('#review-import-select-all')) {
								jQuery('.review', '#reviews-import-table').each(function() {
									if (!jQuery(this).hasClass('error') && jQuery(':input:eq(0)', this).is(':checked') && !jQuery('.submitted:eq(0) :input:eq(0)', this).val().length) {
										jQuery(this).addClass('error');
									}
									else if (jQuery(this).hasClass('error') && (!jQuery('.date:eq(0) :input:eq(0)', this).is(':checked') || jQuery('.date:eq(0) :input:eq(0)', this).is(':checked') && jQuery('.submitted:eq(0) :input:eq(0)', this).val().length)) {
										jQuery(this).removeClass('error');
									}
								});
								return;
							}
							
							if (jQuery(this).is(':checkbox')) {
								if (jQuery('#review-import-select-all').is(':checked')) {
									jQuery('#review-import-select-all').removeProp('checked').removeAttr('checked');
								}
								
								if (jQuery(this).is(':checked') && !jQuery(this).closest('.review').hasClass('error') && !jQuery('.submitted :input:eq(0)', jQuery(this).closest('.review')).val().length) {
									jQuery(this).closest('.review').addClass('error');
								}
								else if (jQuery(this).closest('.review').hasClass('error') && (!jQuery(this).is(':checked') || jQuery(this).is(':checked') && jQuery('.submitted :input:eq(0)', jQuery(this).closest('.review')).val().length)) {
									jQuery(this).closest('.review').removeClass('error');
								}
								return;
							}
							
							if (jQuery(this).attr('type') == 'date') {
								if (!jQuery(this).val().length && !jQuery(this).closest('.review').hasClass('error') && jQuery('.check-column :input:eq(0)', jQuery(this).closest('.review')).is(':checked')) {
									jQuery(this).closest('.review').addClass('error');
								}
								else if (jQuery(this).closest('.review').hasClass('error') && (jQuery(this).val().length || !jQuery('.check-column :input:eq(0)', jQuery(this).closest('.review')).is(':checked'))) {
									jQuery(this).closest('.review').removeClass('error');
								}
							}
							return;
						});
					});
				}
				else {
					if (!jQuery('#html-import-output').length) {
						jQuery('#html-import-input').after('<div id="html-import-output"></div>');
					}
					
					if (!existing_show) {
						jQuery('#html-import-output').html('<p>No new reviews found.</p>');
					}
					else {
						jQuery('#html-import-output').prepend('<p>No additional reviews found.</p>');
					}
					
					jQuery('#import-clear-button').show();
				}
			}
			else {
				jQuery('#reviews-import-table').remove();
				jQuery('#html-import').addClass('error');
			}
			
			jQuery('#html-import-input').html('');
		});
	}

	google_business_reviews_rating_message();
	google_business_reviews_rating_media_image('icon');
	google_business_reviews_rating_media_image('logo');
	google_business_reviews_rating_preview();
	
	if (jQuery('#google-business-reviews-rating-data').length) {
		google_business_reviews_rating_syntax_highlight(jQuery('#google-business-reviews-rating-data'));
	}
		
	if (jQuery('#google-business-reviews-rating-valid-data').length) {
		google_business_reviews_rating_syntax_highlight(jQuery('#google-business-reviews-rating-valid-data'));
	}
		
	return;
}

function google_business_reviews_rating_tab(e) {
	if (typeof e != 'object') {
		return;
	}
	
	var section = (typeof jQuery(e).attr('href') == 'string') ? jQuery(e).attr('href').replace(/#([\w-]+)/, '$1') : null,
		nav_link = (jQuery(e).parent().hasClass('nav-tab-wrapper')),
		e = (!nav_link) ? jQuery('a.nav-tab[href="#' + section + '"]', '#google-business-reviews-rating-settings') : e,
		tab_index = jQuery(e).index('.nav-tab');
	
	if (jQuery(e).hasClass('disabled')) {
		return false;
	}
	
	if (jQuery('.is-dismissible', '#wpbody-content').length) {
		jQuery('.is-dismissible', '#wpbody-content').remove();
	}
	
	if (!nav_link || jQuery('.nav-tab-active', jQuery('nav:eq(0)', '#wpbody-content')).index('.nav-tab')) {
		jQuery('.nav-tab:not(:eq(' +tab_index+'))', jQuery('nav:eq(0)', '#wpbody-content')).removeClass('nav-tab-active').removeProp('aria-current');
		jQuery('.nav-tab:eq(' +tab_index+')', jQuery('nav:eq(0)', '#wpbody-content')).addClass('nav-tab-active').prop('aria-current', 'page');
	}
	
	jQuery('.section', '#wpbody-content').each(function(section_index) {
		if (section == null && section_index == 0 || section != null && section == jQuery(this).attr('id')) {
			if (jQuery(this).hasClass('hide')) {
				jQuery(this).removeClass('hide');
			}
		}
		else if (!jQuery(this).hasClass('hide')) {
			jQuery(this).addClass('hide');
		}
	});
	
	data = {
		action: 'google_business_reviews_rating_admin_ajax',
		type: 'section',
		section: (typeof section == 'string' && !section.match(/^setup$/i)) ? section : null
	};
	
	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success) {
			if (window.history && window.history.pushState) {
				history.pushState(null, null, '#' + section);
			}
			else {
				location.hash = '#' + section;
			}
			
			if (data.section == null) {
				google_business_reviews_rating_preview();
			}
		}
	}, 'json');
			
	setTimeout(function() {
		window.scrollTo(0, 0);
		setTimeout(function() {
			window.scrollTo(0, 0);
			if (tab_index != jQuery('.nav-tab-active', jQuery('nav:eq(0)', '#wpbody-content')).index('.nav-tab')) {
				jQuery('.nav-tab:not(:eq(' + tab_index + '))', jQuery('nav:eq(0)', '#wpbody-content')).removeClass('nav-tab-active').removeProp('aria-current');
				jQuery('.nav-tab:eq(' + tab_index + ')', jQuery('nav:eq(0)', '#wpbody-content')).addClass('nav-tab-active').prop('aria-current', 'page');
			}
			}, 100);
		}, 10);

	return;
}

function google_business_reviews_rating_message(message, type) {
	if (typeof message != 'string') {
		if (typeof type == 'undefined') {
			if (!jQuery('#google-business-reviews-rating-settings-message, #setting-error-settings_updated').length || jQuery('#google-business-reviews-rating-settings-message').length && !jQuery('#google-business-reviews-rating-settings-message').hasClass('invisible')) {
				return;
			}
			
			var e = (jQuery('#google-business-reviews-rating-settings-message').length) ? jQuery('#google-business-reviews-rating-settings-message') : jQuery('#setting-error-settings_updated'),
				message = (jQuery('p', e).length) ? jQuery('p', e).html() : jQuery(e).html(),
				type = (jQuery(e).hasClass('error') || jQuery(e).hasClass('notice-error')) ? 'error' : 'success';
				
			jQuery('#google-business-reviews-rating-settings-message.invisible, #setting-error-settings_updated').remove();
		}
	}
	
	if (typeof type != 'string') {
		var type = 'success';
	}

	if (message.match(/\b(?:refresh|rafraîchir|aktualisieren)\b/i) != null && message.match(/<a[^>]+>/i) == null) {
		message = message.replace(/\b(refresh|reload|rafraîchir|aktualisieren)\b/gi, '<a href="' + document.location.href.replace(/#.*/i, '') + '">$1</a>');
	}
	
	var html = '<div id="google-business-reviews-rating-settings-message" class="notice ' + type + ' notice-' + type + ' visible is-dismissible">\n'
	+ '<p>' + ((message.match(/<\/?\w+/i) == null) ? '<strong>' : '') + message + ((message.match(/<\/?\w+/i) == null) ? '</strong>' : '') + '</p>\n'
	+ '<button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button>\n'
	+ '</div>';
	
	if (jQuery('#google-business-reviews-rating-settings-message').length) {
		jQuery('#google-business-reviews-rating-settings-message').remove();
	}
	
	jQuery('h1:eq(0)', '#google-business-reviews-rating-settings').after(html);
	jQuery('button.notice-dismiss:eq(0)', '#google-business-reviews-rating-settings').on('click', function () {
		jQuery('#google-business-reviews-rating-settings-message').remove();
	});
	
	setTimeout(function() {
		if (jQuery('#google-business-reviews-rating-settings-message').length) {
			jQuery('#google-business-reviews-rating-settings-message').remove();
		}
	}, 15000);

	return;
}

function google_business_reviews_rating_preview(e) {
	if (!jQuery('#google-business-reviews-rating-setup').length || !jQuery('#review-limit').length || jQuery('#review-limit').length && !jQuery('#review-limit').is(':visible')) {
		return;
	}
	
	if (typeof e == 'undefined' || typeof e == 'object' && (!jQuery(e).length || typeof jQuery(e).attr('id') != 'string')) {
		var e = null;
	}
	
	var data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: 'preview',
			limit: (jQuery('#review-limit').val().length && parseInt(jQuery('#review-limit').val()) >= 0) ? parseInt(jQuery('#review-limit').val()) : null,
			view: (jQuery('#carousel-view').val().length && parseInt(jQuery('#carousel-view').val()) >= 0) ? parseInt(jQuery('#carousel-view').val()) : null,
			min: (jQuery('#rating-min').val().length && parseInt(jQuery('#rating-min').val()) >= 0 && parseInt(jQuery('#rating-min').val()) <= 5) ? parseInt(jQuery('#rating-min').val()) : null,
			max: (jQuery('#rating-max').val().length && parseInt(jQuery('#rating-max').val()) >= 0 && parseInt(jQuery('#rating-max').val()) <= 5) ? parseInt(jQuery('#rating-max').val()) : null,
			review_text_min: (jQuery('#review-text-min').val().length && parseInt(jQuery('#review-text-min').val()) >= 0) ? parseInt(jQuery('#review-text-min').val()) : null,
			review_text_max: (jQuery('#review-text-max').val().length && parseInt(jQuery('#review-text-max').val()) >= 0) ? parseInt(jQuery('#review-text-max').val()) : null,
			theme: (jQuery('#reviews-theme').val().length && jQuery('#reviews-theme').val().match(/^[\w ]+$/) && jQuery('#reviews-theme').val() != 'light') ? jQuery('#reviews-theme').val() : null,
			color_scheme: (jQuery(':input:checked', '#color-schemes').length && jQuery(':input:checked:eq(0)', '#color-schemes').val().match(/^[\w _-]+$/) != null) ? jQuery(':input:checked:eq(0)', '#color-schemes').val() : null,
			stylesheet: (!jQuery('#stylesheet-none').length || jQuery('#stylesheet-none').length && !jQuery('#stylesheet-none').is(':checked')),
			sort: (jQuery('#review-sort').val().length && jQuery('#review-sort').val().match(/^[\w_]+$/)) ? jQuery('#review-sort').val() : null,
			excerpt: (jQuery('#review-text-excerpt-length').val().length && parseInt(jQuery('#review-text-excerpt-length').val()) >= 20) ? parseInt(jQuery('#review-text-excerpt-length').val()) : null,
			nonce: jQuery('#google-business-reviews-rating-setup').data('nonce')
		};
		
	if (typeof data.min == 'number' && typeof data.max == 'number' && data.min > data.max) {
		data.min = data.max;
	}
	
	if (typeof data.review_text_min == 'number' && typeof data.review_text_max == 'number' && data.review_text_min > data.review_text_max) {
		data.review_text_min = data.review_text_max;
	}
	
	if (jQuery('#review-limit-hide').is(':checked')) {
		data.limit = 0;
	}
	else if (jQuery('#review-limit-all').is(':checked')) {
		data.limit = null;
	}
		
	if (e != null && jQuery(e).attr('id').match(/^color[_-]?scheme[_-]?[a-z_-]+$/i) != null) {
		if (!data.stylesheet) {
			return;
		}
		
		if (typeof data.theme == 'string' && data.theme.length && typeof data.color_scheme == 'string' && data.color_scheme.length) {
			jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview ' + data.theme + ' ' + data.color_scheme + ((jQuery('#reviews-rating-preview').hasClass('show')) ? ' show' : ''));
		}
		else if (typeof data.theme == 'string' && data.theme.length) {
			jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview ' + data.theme + ((jQuery('#reviews-rating-preview').hasClass('show')) ? ' show' : ''));
		}
		else if (typeof data.color_scheme == 'string' && data.color_scheme.length) {
			jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview ' + data.color_scheme + ((jQuery('#reviews-rating-preview').hasClass('show')) ? ' show' : ''));
		}
		else if (!jQuery('#reviews-rating-preview').hasClass('show')) {
			jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview');
		}
		
		if (jQuery('#google-business-reviews-rating').length && typeof jQuery('#google-business-reviews-rating').attr('class') == 'string') {
			jQuery('#google-business-reviews-rating').attr('class', jQuery('#google-business-reviews-rating').attr('class').replace(/\b(?:\s+(?:cranberry|coral|pumpkin|mustard|forest|turquoise|ocean|amethyst|magenta|slate|carbon|copper|coffee|contrast))\b/gi, '')).addClass(data.color_scheme);
		}
		
		if (!jQuery('.all-stars.clone:eq(0)', '#reviews-rating-preview').length) {
			jQuery('.all-stars:eq(0)', '#reviews-rating-preview').after(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').clone(false).addClass('clone'));
			
			if (jQuery('#google-business-reviews-rating').hasClass('badge') && jQuery('#google-business-reviews-rating').hasClass('tiny')) {
				jQuery('.all-stars.clone:eq(0)', '#reviews-rating-preview').css('margin', String(parseFloat(parseFloat(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').css('top')) + parseFloat(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').css('margin-top')))) + 'px' + ' 0 0 calc(0.1em ' + String(-1 * parseFloat(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').width())) + 'px)');
			}
			else {
				jQuery('.all-stars.clone:eq(0)', '#reviews-rating-preview').css('margin', String(parseFloat(parseFloat(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').css('top')) + parseFloat(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').css('margin-top'))) - 2) + 'px' + ' 0 0 calc(1.27em ' + String(-1 * parseFloat(jQuery('.all-stars:eq(0)', '#reviews-rating-preview').width())) + 'px)');
			}
			
			jQuery('.all-stars.clone:eq(0)', '#reviews-rating-preview').fadeOut(400, function() { jQuery(this).remove(); });
		}

		jQuery('.star', jQuery('.all-stars:eq(0)', '#reviews-rating-preview')).each(function() {
			jQuery(this).removeAttr('style');
		});
		
		if (typeof data.color_scheme != 'string' || !data.color_scheme.length || data.color_scheme.length && data.color_scheme == 'contrast') {
			return;
		}

		if (!jQuery('.rating-stars', '#reviews-rating-preview').length) {
			jQuery('.all-stars:eq(0)', '#reviews-rating-preview').append('<span class="rating-stars star temporary" style="display: none;">.</span>');
		}
		
		if (!jQuery('.star.gray', '#reviews-rating-preview').css('color')) {
			jQuery('.all-stars:eq(0)', '#reviews-rating-preview').append('<span class="star gray temporary" style="display: none;">.</span>');
		}
		
		if (typeof jQuery('.star.gray', '#reviews-rating-preview').css('color') == 'string' && !jQuery('.rating-stars', '#reviews-rating-preview').css('color').match(/^(?:#E7711B|rgba?\s*\(23[12],\s*11[34],\s*2[78](?:,\s*1(?:\.0+)?)?\))$/i)) {
			jQuery('#reviews-rating-preview').data('stars', jQuery('.rating-stars', '#reviews-rating-preview').css('color'));
		}
		
		if (typeof jQuery('.star.gray', '#reviews-rating-preview').css('color') == 'string' && (!jQuery('#reviews-rating-preview').hasClass('dark') && !jQuery('.star.gray', '#reviews-rating-preview').css('color').match(/^(?:#C1C1C1|rgba?\s*\(193,\s*193,\s*193(?:,\s*1(?:\.0+)?)?\))$/i) || jQuery('#reviews-rating-preview').hasClass('dark') && !jQuery('.star.gray', '#reviews-rating-preview').css('color').match(/^(?:#B4B4B4|rgba?\s*\(180,\s*180,\s*180(?:,\s*0?\.8)?\))$/i))) {
			jQuery('#reviews-rating-preview').data('stars-gray', jQuery('.star.gray', '#reviews-rating-preview').css('color'));
		}
		
		if (jQuery('.temporary', jQuery('.all-stars:eq(0)', '#reviews-rating-preview')).length) {
			jQuery('.temporary', jQuery('.all-stars:eq(0)', '#reviews-rating-preview')).remove();
		}
		
		jQuery('.star', jQuery('.all-stars:eq(0)', '#reviews-rating-preview')).each(function(index) {
			try {
				star_image = atob(jQuery(this).css('background-image').replace(/^url\(["']data:image\/svg\+xml;charset=UTF-8;base64,(.+)["']\)$/, '$1'));
				
				if (typeof jQuery('#reviews-rating-preview').data('stars') == 'string') {
					star_image = star_image.replace(/#E7711B/gi, jQuery('#reviews-rating-preview').data('stars'));
				}

				if (typeof jQuery('#reviews-rating-preview').data('stars-gray') == 'string' && jQuery('#reviews-rating-preview').data('stars-gray').length) {
					star_image = star_image.replace(/#C1C1C1/gi, jQuery('#reviews-rating-preview').data('stars-gray'));
				}

				jQuery(this).css('background-image', 'url(\'data:image\/svg+xml;charset=UTF-8;base64,' + btoa(star_image) + '\')');
			}
			catch (err) {
				return;
			}
		});
		
		jQuery(this).css('opacity', 1);
			
		return;
	}
	
	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success) {
			if (jQuery('#reviews-rating-preview-heading').hasClass('hide')) {
				if (window.outerWidth < 1450) {
					jQuery('#reviews-rating-preview-heading').slideDown(300, function() {
						jQuery('#reviews-rating-preview-heading').removeAttr('class').removeAttr('style');
					});
				}
				else {
					jQuery('#reviews-rating-preview-heading').removeAttr('class');
				}
			}
			
			if (typeof data.theme == 'string' && data.theme.length && typeof data.color_scheme == 'string' && data.color_scheme.length) {
				jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview ' + data.theme + ' ' + data.color_scheme + ((jQuery('#reviews-rating-preview').hasClass('show')) ? ' show' : ''));
			}
			else if (typeof data.theme == 'string' && data.theme.length) {
				jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview ' + data.theme + ((jQuery('#reviews-rating-preview').hasClass('show')) ? ' show' : ''));
			}
			else if (typeof data.color_scheme == 'string' && data.color_scheme.length) {
				jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview ' + data.color_scheme + ((jQuery('#reviews-rating-preview').hasClass('show')) ? ' show' : ''));
			}
			else if (!jQuery('#reviews-rating-preview').hasClass('show')) {
				jQuery('#reviews-rating-preview').prop('class', 'google-business-reviews-rating-preview');
			}
			
			jQuery('#reviews-rating-preview').html(response.html);
			
			jQuery('.star', jQuery('.all-stars', '#reviews-rating-preview')).each(function() {
				jQuery(this).removeAttr('style');
			});
			
			if (typeof data.color_scheme == 'string' && data.color_scheme.length && data.color_scheme != 'contrast') {
				var star_image = null;
				
				if (!jQuery('.rating-stars', '#reviews-rating-preview').length) {
					jQuery('.all-stars', '#reviews-rating-preview').append('<span class="rating-stars star temporary" style="display: none;">.</span>');
				}
				
				if (!jQuery('.star.gray', '#reviews-rating-preview').css('color')) {
					jQuery('.all-stars', '#reviews-rating-preview').append('<span class="star gray temporary" style="display: none;">.</span>');
				}
				
				if (typeof jQuery('.star.gray', '#reviews-rating-preview').css('color') == 'string' && !jQuery('.rating-stars', '#reviews-rating-preview').css('color').match(/^(?:#E7711B|rgba?\s*\(23[12],\s*11[34],\s*2[78](?:,\s*1(?:\.0+)?)?\))$/i)) {
					jQuery('#reviews-rating-preview').data('stars', jQuery('.rating-stars', '#reviews-rating-preview').css('color'));
				}
				
				if (typeof jQuery('.star.gray', '#reviews-rating-preview').css('color') == 'string' && (!jQuery('#reviews-rating-preview').hasClass('dark') && !jQuery('.star.gray', '#reviews-rating-preview').css('color').match(/^(?:#C1C1C1|rgba?\s*\(193,\s*193,\s*193(?:,\s*1(?:\.0+)?)?\))$/i) || jQuery('#reviews-rating-preview').hasClass('dark') && !jQuery('.star.gray', '#reviews-rating-preview').css('color').match(/^(?:#B4B4B4|rgba?\s*\(180,\s*180,\s*180(?:,\s*0?\.8)?\))$/i))) {
					jQuery('#reviews-rating-preview').data('stars-gray', jQuery('.star.gray', '#reviews-rating-preview').css('color'));
				}
				
				if (jQuery('.temporary', jQuery('.all-stars', '#reviews-rating-preview')).length) {
					jQuery('.temporary', jQuery('.all-stars', '#reviews-rating-preview')).remove();
				}
				
				jQuery('.star', jQuery('.all-stars', '#reviews-rating-preview')).each(function(index) {
					try {
						star_image = atob(jQuery(this).css('background-image').replace(/^url\(["']data:image\/svg\+xml;charset=UTF-8;base64,(.+)["']\)$/, '$1'));
						
						if (typeof jQuery('#reviews-rating-preview').data('stars') == 'string') {
							star_image = star_image.replace(/#E7711B/gi, jQuery('#reviews-rating-preview').data('stars'));
						}
	
						if (typeof jQuery('#reviews-rating-preview').data('stars-gray') == 'string' && jQuery('#reviews-rating-preview').data('stars-gray').length) {
							star_image = star_image.replace(/#C1C1C1/gi, jQuery('#reviews-rating-preview').data('stars-gray'));
						}
	
						jQuery(this).css('background-image', 'url(\'data:image\/svg+xml;charset=UTF-8;base64,' + btoa(star_image) + '\')');
					}
					catch (err) {
						return;
					}
				});
			}
			
			if (typeof google_business_reviews_rating == 'function') {
				google_business_reviews_rating(jQuery('#reviews-rating-preview > div'));
			}
			
			return;
		}

		if (!jQuery('#reviews-rating-preview-heading').hasClass('hide')) {
			jQuery('#reviews-rating-preview-heading').addClass('class');
		}
		
		if (!jQuery('#reviews-rating-preview').hasClass('hide')) {
			jQuery('#reviews-rating-preview').addClass('class');
		}
	}, 'json');

	return;
}

function google_business_reviews_rating_media_image(image_type) {
	var data = {},
		image_section = jQuery('.' + ((image_type == 'icon') ? 'business-' : '') + image_type + '-image:eq(0)'),
		image_id = null
		image_frame = null;
		
	jQuery('#' + image_type + '-image-delete').on('click', function(event) {
		data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: image_type + '_delete',
			nonce: jQuery('#google-business-reviews-rating-setup').data('nonce')
		};
		jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
			if (response.success) {
				jQuery('#' + image_type + '-image-id').val('');
				jQuery('img', '#' + image_type + '-image-preview').remove();
				jQuery('#' + image_type + '-image-preview').html('');
				jQuery('#' + image_type + '-image').html(jQuery('.dashicons', '#' + image_type + '-image')[0].outerHTML + ' ' + jQuery('#' + image_type + '-image').data('set-text'));
				jQuery(image_section).addClass('empty');
				jQuery('.delete', image_section).hide();
				jQuery('#' + image_type + '-image-row').addClass('empty');
				google_business_reviews_rating_preview();
			}
		}, 'json');
		return;
	});
	
	jQuery('#' + image_type + '-image, #' + image_type + '-image-preview').on('click', { image_type: image_type }, function(event) {
		event.preventDefault();
		
		if (typeof wp == 'undefined') {
			return;
		}
		
		if (image_frame != null) {
			return image_frame.open();
		}
		
		var image_frame = wp.media({
				title: 'Select Media',
				multiple: false,
				library: { type: 'image' }
			}),
			image_type = event.data.image_type;
			
		image_frame.on('select', function() {
			var selection = image_frame.state().get('selection'),
				gallery_ids = [],
				image_id = null;
				
			selection.each(function(attachment) {
				if (image_id == null) {
					image_id = attachment['id'];
					return;
				}
			});
			
			if (image_id == null) {
				return;
			}
			
			jQuery('#' + image_type + '-image-id').val(image_id);
			data = {
				action: 'google_business_reviews_rating_admin_ajax',
				type: image_type,
				id: image_id,
				nonce: jQuery('#google-business-reviews-rating-setup').data('nonce')
			};
			
			jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
				if (response.success) {
					var image_section = jQuery('.' + ((data.type == 'icon') ? 'business-' : '') + data.type + '-image:eq(0)');
					jQuery('#' + data.type + '-image-row').removeClass('empty');
					jQuery(image_section).removeClass('empty');
					jQuery('#' + data.type + '-image-preview').html(response.image.replace(/\s+class=['"][^'"<]*['"]/i, '')).addClass('image');
					jQuery('#' + data.type + '-image').html(jQuery('.dashicons', '#' + data.type + '-image')[0].outerHTML + ' ' + jQuery('#' + data.type + '-image').data('replace-text'));
					jQuery('.delete', image_section).css('display', 'inline-block');
					google_business_reviews_rating_preview();
				}
			}, 'json');
		});
		
		image_frame.on('open', function() {
			var selection = image_frame.state().get('selection'),
				ids = jQuery('#' + image_type + '-image-id').val().split(',');
				
			ids.forEach(function(id) {
				var attachment = wp.media.attachment(id);
				attachment.fetch();
				selection.add(attachment ? [attachment] : []);
			});
		});
		
		image_frame.open();
	});
	return;
}

function google_business_reviews_rating_syntax_highlight(e) {
	if (typeof e == 'undefined') {
		var e = jQuery('#google-business-reviews-rating-data');
	}
	
	if (!jQuery(e).length || jQuery('span', jQuery(e)).length) {
		return;
	}
	
	var json = e.html().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	jQuery(e)
		.html(json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
			var class_name = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					class_name = 'key';
				}
				else {
					class_name = 'string';
				}
			}
			else if (/true|false/.test(match)) {
				class_name = 'boolean';
			}
			else if (/null/.test(match)) {
				class_name = 'null';
			}
			return '<span class="' + class_name + '">' + match + '</span>';
		}));
		
	if (jQuery(e).attr('id').match(/structured[_-]?data/i)) {
		jQuery(e).html(jQuery(e).html().replace(/(<span\s+class="key">"image":<\/span>\s+<span\s+class="boolean)(">)(false)(<\/span>)/i, '$1 error$2$3 <span class="dashicons dashicons-warning" title="Required"></span>$4'));
	}
	
	return;
}

function google_business_reviews_rating_submitted(e) {	
	if (typeof e == 'undefined') {
		return;
	}
	
	var e = jQuery(e).closest('.review'),
		data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: 'submitted',
			review: jQuery(e).attr('id').replace(/[^0-9a-z_]/gi, '_'),
			submitted: jQuery('.time-estimate:input', e).val(),
			nonce: jQuery('#reviews-table').data('nonce')
		};
	
	if (!jQuery(e).hasClass('estimate') || !jQuery('.time-estimate:input', e).val().length) {
		return;
	}
	
	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success) {
			jQuery('.date-edit:eq(0) .value:eq(0)', jQuery('.submitted', e)).text(jQuery('.time-estimate:input', e).val().replace(/-/g, '/'));
		}
		jQuery('.time-estimate:input', e).hide();
		jQuery('.date-edit:eq(0)', jQuery('.submitted', e)).show();
	}, 'json');
	return;
}

function google_business_reviews_rating_language(e) {	
	if (typeof e == 'undefined') {
		return;
	}
	
	var e = jQuery(e).closest('.review'),
		data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: 'language',
			review: jQuery(e).attr('id').replace(/[^0-9a-z_]/gi, '_'),
			language: jQuery('.language:input:eq(0)', e).val(),
			nonce: jQuery('#reviews-table').data('nonce')
		};

	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success) {
			jQuery('.language-edit:eq(0) .value:eq(0)', jQuery('.language', e)).text((response.language != null && response.language.length) ? jQuery('.language:input', e).val().replace(/_/g, '-') : '—');
		}

		jQuery('.language:input:eq(0)', e).hide();
		jQuery('.language-edit:eq(0)', jQuery('.language', e)).show();
	}, 'json');
	return;
}

function google_business_reviews_rating_sort(e) {	
	if (typeof e == 'undefined' || jQuery('.review', jQuery('tbody', '#reviews-table')).length <= 1) {
		return;
	}
	
	var data = {
			action: 'google_business_reviews_rating_admin_ajax',
			section: 'reviews',
			type: 'sort',
			sort: jQuery(e).data('field') + ((jQuery(e).closest('th').hasClass('sorted')) ? ((jQuery(e).closest('th').hasClass('asc')) ? '_desc' : '_asc') : ''),
			nonce: jQuery('#reviews-table').data('nonce')
		};
	
	if (!jQuery(e).closest('th').hasClass('sorted')) {
		jQuery(e).closest('th').siblings('.sorted').removeClass('sorted');
		jQuery(e).closest('th').addClass('sorted');
		
		if (jQuery(e).data('field').match(/^(?:date|relevance|retrieved|submitted|time)$/i)) {
			jQuery(e).closest('th').addClass('desc');
		}
		else {
			jQuery(e).closest('th').addClass('asc');
		}
	}
	else if (jQuery(e).closest('th').hasClass('asc')) {
		jQuery(e).closest('th').removeClass('asc').addClass('desc');
	}
	else if (jQuery(e).closest('th').hasClass('desc')) {
		jQuery(e).closest('th').removeClass('desc').addClass('asc');
	}
	else if (jQuery(e).data('field').match(/^(?:date|retrieved|submitted|time)$/i)) {
		jQuery(e).closest('th').addClass('desc');
	}
	else {
		jQuery(e).closest('th').addClass('asc');
	}
	
	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success && typeof response.ids == 'object') {
			var rows = jQuery('.review', jQuery('tbody', '#reviews-table')).get();
			
			rows.sort(function(a, b) {
				return (response.ids.indexOf(jQuery(a).attr('id').replace(/-/g, '_')) - response.ids.indexOf(jQuery(b).attr('id').replace(/-/g, '_')));
			});
			
			jQuery.each(rows, function(index, row) {
				jQuery('tbody', '#reviews-table').append(row);
			});
			
			if (typeof response.clear == 'boolean' && response.clear) {
				jQuery('.sorted', jQuery('thead', '#reviews-table')).removeClass('asc').removeClass('desc').removeClass('sorted');
			}
		}
	}, 'json');
	return;
}

function google_business_reviews_rating_status(e) {	
	if (typeof e == 'undefined') {
		return;
	}
	
	var e = jQuery(e).closest('.review'),
		data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: 'status',
			review: jQuery(e).attr('id').replace(/[^0-9a-z_]/gi, '_'),
			status: jQuery(e).hasClass('inactive'),
			nonce: jQuery('#reviews-table').data('nonce')
		};
	
	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success) {
			if (data.status) {
				jQuery(e).removeClass('inactive');
				jQuery('.show-hide .dashicons', e).removeClass('dashicons-hidden').addClass('dashicons-visibility');
				jQuery('.show-hide', e).prop('title', 'Hide');
			}
			else {
				jQuery(e).addClass('inactive');
				jQuery('.show-hide .dashicons', e).removeClass('dashicons-visibility').addClass('dashicons-hidden');
				jQuery('.show-hide', e).prop('title', 'Show');
			}
		}
	}, 'json');
	return;
}

function google_business_reviews_rating_remove(e) {	
	if (typeof e == 'undefined') {
		return;
	}
	
	var e = jQuery(e).closest('.review'),
		data = {
			action: 'google_business_reviews_rating_admin_ajax',
			type: 'delete',
			review: jQuery(e).attr('id').replace(/[^0-9a-z_]/gi, '_'),
			nonce: jQuery('#reviews-table').data('nonce')
		};
	
	if (!jQuery(e).hasClass('removable')) {
		return;
	}

	jQuery.post(google_business_reviews_rating_admin_ajax.url, data, function(response) {
		if (response.success) {
			jQuery(e).remove();
		}
	}, 'json');
	return;
}

function google_business_reviews_rating_widget(e, event) {
	if (typeof event == 'undefined' || event == null) {
		if (typeof jQuery(e) == 'string' && jQuery(e).length) {
			e = jQuery(e);
		}
		else if (typeof jQuery(e) == 'object' && !jQuery(e).length) {
			return false
		}
		
		var event = null;
	}
	
	var inputs = (jQuery(e).is(':input')) ? e : jQuery(':input', jQuery('.google-business-reviews-rating', e)),
		e = (jQuery(e).is(':input')) ? jQuery(e).closest('.google-business-reviews-rating') : (!jQuery(e).hasClass('.google-business-reviews-rating')) ? jQuery('.google-business-reviews-rating', e) : e,
		limit = (jQuery(':input:eq(0)', jQuery('.limit', e)).length && jQuery(':input:eq(0)', jQuery('.limit', e)).val().match(/^\d+$/) != null && parseInt(jQuery(':input:eq(0)', jQuery('.limit', e)).val()) >= 0) ? parseInt(jQuery(':input:eq(0)', jQuery('.limit', e)).val()) : ((typeof jQuery(e).data('limit') == 'number') ? ((jQuery(e).data('limit') >= 1) ? jQuery(e).data('limit') : 0) : null),
		name = null;
	
	if (event == null) {
		jQuery(':input', e).on('change', function(event) {
			if (typeof jQuery(this).attr('name') != 'string') {
				return;
			}
			
			google_business_reviews_rating_widget(this, event)
		});
		
		event = null;
	}
	
	jQuery(inputs).each(function() {
		if (typeof jQuery(this).attr('name') != 'string') {
			return;
		}
		
		name = jQuery(this).attr('name').replace(/^[^\[]+(?:\[\d+\])?\[([0-9a-z_-]+)\]$/i, '$1').replace(/-/g, '_');
		
		switch(name) {
		case 'theme':
			if (jQuery(this).val().match(/\bbadge|tiny\b/) == null) {
				break;
			}
			
			if (event != null && limit != null && limit >= 1) {
				jQuery(e).data('limit', limit);
			}
			
			limit = 0;
			jQuery(':input:eq(0)', jQuery('.limit', e)).val(limit);
			
			if (!jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.sort:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.language:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', true);
			}
			
			if (jQuery('.display-reviews:eq(0)', jQuery('.display-options', e)).is(':checked')) {
				jQuery('.display-reviews:eq(0)', jQuery('.display-options', e)).prop('checked', false).removeAttr('checked');
			}
			
			if (!jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).is(':disabled')) {
				jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).prop('disabled', true);
				jQuery('.display-avatar:eq(0)', jQuery('.display-options', e)).prop('disabled', true);
			}
			break;
		case 'limit':
			if (typeof limit == 'number' && limit >= 1) {
				if (event != null || (event == null && (jQuery(e).data('limit') == null || parseInt(jQuery(e).data('limit')) < 1))) {
					jQuery(e).data('limit', limit);
				}
				
				if (jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).is(':disabled')) {
					jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.sort:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.language:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
				}
				
				if (jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val().match(/^\d+$/) != null) {
					if (parseInt(jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val()) >= limit) {
						jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val((jQuery(this).val() >= 2) ? jQuery(this).val() - 1 : '');
					}
					
					if (jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':disabled')) {
						jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).removeClass('inactive');
						jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					}
					
					if (jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':checked') && jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
						jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).removeClass('inactive');
						jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					}
					else if (!jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':checked') && !jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
						jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
						jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
					}
					
					jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).prop('max', (jQuery(this).val() >= 2) ? jQuery(this).val() - 1 : 1);
				}
				else {
					if (!jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':disabled')) {
						jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('checked', false).removeAttr('checked').prop('disabled', true);
						jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).addClass('inactive');
					}
					
					if (!jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
						jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
						jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
					}
				}
				
				if (jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).is(':disabled')) {
					jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).prop('disabled', false).removeAttr('disabled');
					jQuery('.display-avatar:eq(0)', jQuery('.display-options', e)).prop('disabled', false).removeAttr('disabled');
				}
				
				if (!jQuery('.display-reviews:eq(0)', jQuery('.display-options', e)).is(':checked')) {
					jQuery('.display-reviews:eq(0)', jQuery('.display-options', e)).prop('checked', true);
				}
				break;
			}
		
			jQuery(this).val(0);
			
			if (!jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val('').prop('max', 1);
				jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.sort:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.language:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).prop('disabled', true);
				jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', true);
				jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).addClass('inactive');
				jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
			}
			
			if (jQuery('.display-reviews:eq(0)', jQuery('.display-options', e)).is(':checked')) {
				jQuery('.display-reviews:eq(0)', jQuery('.display-options', e)).prop('checked', false).removeAttr('checked');
			}
			
			if (!jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).is(':disabled')) {
				jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).prop('disabled', true);
				jQuery('.display-avatar:eq(0)', jQuery('.display-options', e)).prop('disabled', true);
			}
			break;
		case 'view':
			if (jQuery(this).val().match(/^\d+$/) != null && parseInt(jQuery(this).val()) < 1) {
				jQuery(this).val('');
			}
			
			if (limit != null && limit > 1) {
				jQuery(this).prop('max', (jQuery(':input:eq(0)', jQuery('.limit:eq(0)', e)).val() >= 2) ? jQuery(':input:eq(0)', jQuery('.limit:eq(0)', e)).val() - 1 : 1);
				
				if (typeof limit == 'number' && parseInt(jQuery(this).val()) > parseInt(jQuery(this).attr('max'))) {
					jQuery(this).val(jQuery(this).attr('max'));
				}
			}
			else {
				jQuery(this).val('').prop('max', 1);
			}
			
			if (jQuery(this).val().length && jQuery(this).val().match(/^\d+$/) != null && parseInt(jQuery(this).val()) >= 1) {
				if (jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':disabled')) {
					jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).removeClass('inactive');
					jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
				}
				
				if (jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':checked') && jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
					jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).removeClass('inactive');
					jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
				}
				else if (!jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':checked') && !jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
					jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
					jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
				}
				break;
			}
			
			if (!jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('checked', false).removeAttr('checked').prop('disabled', true);
				jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).addClass('inactive');
			}
			
			if (!jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
				jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
			}
			break;
		case 'loop':
			if (jQuery(this).is(':checked') && jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
				jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).removeClass('inactive');
				jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
			}
			else if (!jQuery(this).is(':checked') && !jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
				jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
			}
			break;
		case 'rating_min':
			if (jQuery(this).val().match(/^[1-5]$/) == null) {
				jQuery(this).val(0);
				break;
			}
			
			if (parseInt(jQuery(this).val()) > parseInt(jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).val())) {
				jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).val(jQuery(this).val());
			}
			break;
		case 'rating_max':
			if (jQuery(this).val().match(/^[1-5]$/) == null) {
				jQuery(this).val(5);
				break;
			}
			
			if (parseInt(jQuery(this).val()) < parseInt(jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).val())) {
				jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).val(jQuery(this).val());
			}
			break;
		case 'review_text_min':
			if (jQuery(this).val().match(/^\d+$/) == null) {
				jQuery(this).val(0);
				break;
			}
			
			if (jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).val().length && parseInt(jQuery(this).val()) > parseInt(jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).val())) {
				jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).val(jQuery(this).val());
			}
			break;
		case 'review_text_max':
			if (!jQuery(this).val().length) {
				break;
			}
			
			if (jQuery(this).val().match(/^\d+$/) == null) {
				jQuery(this).val('');
				break;
			}
			
			if (parseInt(jQuery(this).val()) < parseInt(jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).val())) {
				jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).val(jQuery(this).val());
			}
			break;
		case 'excerpt_length':
			if (jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).val().length && jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
			}
			else if (!jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).val().length && !jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).is(':disabled')) {
				jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', true);
			}
			break;
		case 'display_name':
		case 'display_icon':
			if (event == null) {
				if (!jQuery('.display-name:eq(0)', jQuery('.display-options', e)).is(':checked')) {
					jQuery('.name', jQuery('.business-name', e)).hide();
				}
				else {
					jQuery('.name', jQuery('.business-name', e)).show();
				}

				if (!jQuery('.display-icon:eq(0)', jQuery('.display-options', e)).is(':checked')) {
					jQuery('.icon', jQuery('.business-name', e)).hide();
				}
				else {
					jQuery('.icon', jQuery('.business-name', e)).show();
				}

				if (!jQuery('.display-name:eq(0)', jQuery('.display-options', e)).is(':checked') && !jQuery('.display-icon:eq(0)', jQuery('.display-options', e)).is(':checked')) {
					jQuery('.business-name', e).hide();
				}
				else {
					jQuery('.business-name', e).show();
				}

				break;
			}
			
			if ((jQuery('.display-name:eq(0)', jQuery('.display-options', e)).is(':checked') || jQuery('.display-icon:eq(0)', jQuery('.display-options', e)).is(':checked')) && (jQuery('.business-name', e).is(':hidden') || jQuery(e).is(':hidden'))) {
				jQuery('.business-name', e).slideDown(300);
			}
			
			if (jQuery('.display-name:eq(0)', jQuery('.display-options', e)).is(':checked') && (jQuery('.name', jQuery('.business-name', e)).is(':hidden') || jQuery(e).is(':hidden'))) {
				jQuery('.name', jQuery('.business-name', e)).slideDown(300);
			}
			else if (!jQuery('.display-name:eq(0)', jQuery('.display-options', e)).is(':checked') && jQuery('.name', jQuery('.business-name', e)).is(':visible')) {
				jQuery('.name', jQuery('.business-name', e)).slideUp(300);
			}
			
			if (jQuery('.display-icon:eq(0)', jQuery('.display-options', e)).is(':checked') && (jQuery('.icon', jQuery('.business-name', e)).is(':hidden') || jQuery(e).is(':hidden'))) {
				jQuery('.icon', jQuery('.business-name', e)).slideDown(300);
			}
			else if (!jQuery('.display-icon:eq(0)', jQuery('.display-options', e)).is(':checked') && jQuery('.icon', jQuery('.business-name', e)).is(':visible')) {
				jQuery('.icon', jQuery('.business-name', e)).slideUp(300);
			}
			
			if (!jQuery('.display-name:eq(0)', jQuery('.display-options', e)).is(':checked') && !jQuery('.display-icon:eq(0)', jQuery('.display-options', e)).is(':checked')) {
				jQuery('.business-name', e).slideUp(300);
			}
			
			break;
		case 'display_reviews':
			if (jQuery(this).is(':checked')) {
				if (jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).is(':disabled')) {
					jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).prop('disabled', false).removeAttr('disabled');
					jQuery('.display-avatar:eq(0)', jQuery('.display-options', e)).prop('disabled', false).removeAttr('disabled');
				}
				
				if (limit != null && limit < 1) {
					limit = jQuery(e).data('limit');
					
					if (limit >= 1) {
						limit = jQuery(e).data('limit');
						jQuery(':input:eq(0)', jQuery('.limit', e)).val(limit);
						
						if (jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val().match(/^\d+$/) != null) {
							if (parseInt(jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val()) >= limit) {
								jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val((limit >= 2) ? limit - 1 : '');
							}
							
							jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).prop('max', (limit >= 2) ? limit - 1 : 1);
							
							if (jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':disabled')) {
								jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).removeClass('inactive');
								jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
							}
							
							if (jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':checked') && jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
								jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).removeClass('inactive');
								jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
							}
							else if (!jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':checked') && !jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
								jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
								jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
							}
						}

					}
					else {
						limit = 1;
						jQuery(':input:eq(0)', jQuery('.limit', e)).val(limit);
						jQuery(':input:eq(0)', jQuery('.view', e)).val('').prop('max', 1);
					}
				}
				
				if (jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).is(':disabled')) {
					jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.sort:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.language:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
					jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', false).removeAttr('disabled');
				}
			}
			else if (!jQuery(this).is(':checked')) {
				if (limit != null && limit >= 1) {
					jQuery(e).data('limit', limit);
					limit = 0;
					jQuery(':input:eq(0)', jQuery('.limit', e)).val(limit);
				}
				
				if (!jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).is(':disabled')) {
					jQuery('.display-review-text:eq(0)', jQuery('.display-options', e)).prop('disabled', true);
					jQuery('.display-avatar:eq(0)', jQuery('.display-options', e)).prop('disabled', true);
				}
				
				if (!jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).is(':disabled')) {
					jQuery(':input:eq(0)', jQuery('.view:eq(0)', e)).val('').prop('max', 1).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.offset:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.sort:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.rating:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(1)', jQuery('.rating:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.language:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(1)', jQuery('.review-text-length:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.excerpt-length:eq(0)', e)).prop('disabled', true);
					jQuery(':input:eq(0)', jQuery('.more-text:eq(0)', e)).prop('disabled', true);
				}
			}
			
			if (jQuery(':input:eq(0)', jQuery('.view', e)).is(':disabled') || jQuery(':input:eq(0)', jQuery('.view', e)).val().length) {
				if (!jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).is(':disabled')) {
					jQuery(':input:eq(1)', jQuery('.view:eq(0)', e)).prop('checked', false).removeAttr('checked').prop('disabled', true);
					jQuery('label:eq(1)', jQuery('.view:eq(0)', e)).addClass('inactive');
				}
				
				if (!jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).is(':disabled')) {
					jQuery(':input:eq(2)', jQuery('.view:eq(0)', e)).prop('disabled', true);
					jQuery('label:eq(2)', jQuery('.view:eq(0)', e)).addClass('inactive');
				}
			}
			break;
		case 'display_attribution':
			if (event == null) {
				if (!jQuery('.display-attribution:eq(0)', jQuery('.display-options', e)).is(':checked')) {
					jQuery('.plugin-attribution', e).hide();
				}
				else {
					jQuery('.plugin-attribution', e).show();
				}
				break;
			}

			if (jQuery('.display-attribution:eq(0)', jQuery('.display-options', e)).is(':checked') && (jQuery('.plugin-attribution', e).is(':hidden') || jQuery(e).is(':hidden'))) {
				jQuery('.plugin-attribution', e).slideDown(300);
			}
			else if (!jQuery('.display-attribution:eq(0)', jQuery('.display-options', e)).is(':checked') && jQuery('.plugin-attribution', e).is(':visible')) {
				jQuery('.plugin-attribution', e).slideUp(300);
			}
			
			break;
		}
	});
	
	return;
}

jQuery(document).ready(function($) {
	google_business_reviews_rating_admin();
	if (window.history && window.history.pushState) {
		jQuery(window).on('popstate', function() {
			google_business_reviews_rating_admin(true);
		});
	}
	
	return;
});

jQuery(window).on('keydown', function(event) {
	if (!jQuery('#google-business-reviews-rating-settings').length) {
		return;
	}
	
	if (jQuery('.button-primary').is(':visible') && (event.ctrlKey || event.metaKey)) {
		if (String.fromCharCode(event.which).toLowerCase() == 's') {
			event.preventDefault();
			jQuery('.button-primary:visible:eq(0)').trigger('click');
			return false;
		}
	}

	return;
});

jQuery(document).on('widget-added', function () {
	if (!jQuery('.google-business-reviews-rating').length) {
		return;
	}
	
	jQuery('.google-business-reviews-rating').each(function() {
		if (typeof jQuery(this).data('widget-init') == 'boolean' && jQuery(this).data('widget-init')) {
			return;
		}
		
		jQuery(this).data('widget-init', true);
		google_business_reviews_rating_widget(jQuery(this).parent());
	});
	
	return;
});
