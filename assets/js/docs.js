/**
 * Clipboardify all the things!
 */
+function() {
  if (window.Clipboard) {
    // Funzioni generali
    function clearTooltip(e) {
      e.currentTarget.classList.remove('tooltipped');
      e.currentTarget.removeAttribute('aria-label');
    }

    // Applico per ogni listing
    var listings = document.querySelectorAll('.listingblock code');
    for (var i=0; i < listings.length; i++) {
      var listing = listings[i];
      listing.id = '_listingblock-' + i;

      var copyBtn = document.createElement('button');
      copyBtn.innerHTML = 'Copia'
      copyBtn.setAttribute('data-clipboard-target', '#' + listing.id);
      [
        'button', 'button-copy', 'is-info', 'is-small',
        'tooltipped-s', 'tooltipped-no-delay'
      ].forEach(function(c) {
        copyBtn.classList.add(c);
      });

      copyBtn.addEventListener('mouseleave', clearTooltip);
      copyBtn.addEventListener('blur', clearTooltip);

      listing.parentNode.insertBefore(copyBtn, listing.nextSibling);
    }
    var clipboard = new Clipboard('.button-copy');

    clipboard.on('success', function(e) {
      e.trigger.classList.add('tooltipped');
      e.trigger.setAttribute('aria-label', 'Copiato!');
      e.clearSelection();
    });

  }
}();

/**
 * Handle sidebar
 */
+function() {
  // Resize
  var sidebarColumn       = document.querySelector('.documentation-sidebar-column');
  var sidebarFixed        = document.querySelector('.documentation-sidebar');
  var originalPaddingLeft = parseFloat(window.getComputedStyle(sidebarFixed).paddingLeft);

  function updateSidebarWidth(e) {
    var width = (originalPaddingLeft + sidebarColumn.offsetWidth) + 'px';

    if (e != null) {
      // We are inside event listener
      window.requestAnimationFrame(function() {
        sidebarFixed.style.width = width;
      });
    }
    else {
      sidebarFixed.style.width = width;
    }
  }

  updateSidebarWidth();
  window.addEventListener('resize', updateSidebarWidth);


  // Keep scroll
  var STORAGE_SCROLL_KEY = 'k2SidebarScroll';
  if (window.sessionStorage) {
    var previousScroll = parseFloat(sessionStorage.getItem(STORAGE_SCROLL_KEY));
    if (previousScroll) {
      sidebarFixed.scrollTop = previousScroll;
    }

    sidebarFixed.addEventListener('scroll', function(e) {
      sessionStorage.setItem(STORAGE_SCROLL_KEY, sidebarFixed.scrollTop);
    });
  }
}();

/**
 * Algolia search
 */
+function() {
  function printHierarchyLevel(lvl) {
    if (lvl == null) return '';
    return '<span class="hierarchy-level">' + lvl + '</span>'
  }

  function printHierarchy(suggestion) {
    return [
      '<h3>',
      printHierarchyLevel(suggestion.hierarchy.lvl0),
      printHierarchyLevel(suggestion.hierarchy.lvl1),
      printHierarchyLevel(suggestion.hierarchy.lvl2),
      printHierarchyLevel(suggestion.hierarchy.lvl3),
      printHierarchyLevel(suggestion.hierarchy.lvl4),
      printHierarchyLevel(suggestion.hierarchy.lvl5),
      printHierarchyLevel(suggestion.hierarchy.lvl6),
      '</h3>'
    ].join(' ');
  }

  var client = algoliasearch('NG5XN28AYR', 'eddd68792fb3c02bc2085c0faeaa06de');
  var index = client.initIndex('docs');
  autocomplete('#search-input', { hint: false/*, debug: true*/ }, [
    {
      source: autocomplete.sources.hits(index, { hitsPerPage: 5 }),
      displayKey: 'title',
      templates: {
        suggestion: function(suggestion) {
          return '<div>' + // suggestion._highlightResult.title.value
                 ' <h3>'+ printHierarchy(suggestion) +'</h3>' +
                 ' <p>' +suggestion._highlightResult.content.value + '</p>' +
                 '</div>';
        },
        footer: function() {
          return '<a href="https://www.algolia.com" class="algolia-powered-by-link" title="Algolia">' +
                 ' <img class="algolia-logo" src="/assets/images/algolia.svg" alt="Algolia" />' +
                 '</a>';
        }
      }
    }
  ]).on('autocomplete:selected', function(event, suggestion, dataset) {
    window.location.href = suggestion.url +
      (suggestion.anchor == null ?  '' : '#' + suggestion.anchor);
  });
}();
