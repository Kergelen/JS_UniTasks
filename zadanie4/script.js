$(document).ready(function() {
  let ascendingOrder = true;
  let accessToken = 'BQDr9cUlKGyOWpcF9X73IbpX-5ulIhMqBgrmEW8crmtLVmYykQ0-zxmTFlhO9N-1YyR-_Aqpoiwq-kBykzmc2Wh7T3aLgOQ7yln_eV0Zhj-CSyk94awz8hGgLquop1iXFFFuPFjcwMr0dqfX2BVIUdA1f7cIVbQMYygxoz-D46MD_IY3g-piPYFBxi717uxFH8th9HDLKemVVfHpRuKP4So';

  function fetchUserInfo() {
    return $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
  }

  function fetchUserPlaylists() {
    return $.ajax({
      url: 'https://api.spotify.com/v1/me/playlists',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    });
  }

  function displayUserInfo() {
    fetchUserInfo().done(function(userInfo) {
      $('#profile-picture').attr('src', userInfo.images[0].url);
      $('#nickname').text(userInfo.display_name);
    });
  }

  function displayUserPlaylists() {
    const sortSelect = $('#sort-select');
    const playlistList = $('#playlist-list');
    playlistList.empty();

    fetchUserPlaylists().done(function(data) {
      let playlists = data.items;

      const sortBy = sortSelect.val();
      if (sortBy === 'name') {
        playlists.sort((a, b) => (ascendingOrder ? 1 : -1) * a.name.localeCompare(b.name));
      } 
      else if (sortBy === 'songs') {
        playlists.sort((a, b) => (ascendingOrder ? 1 : -1) * (a.tracks.total - b.tracks.total));
      }

      $.each(playlists, function(index, playlist) {
        const playlistElement = $('<div>').addClass('playlist').html(`
          <img src="${playlist.images[0].url}" alt="${playlist.name}">
          <h3>${playlist.name}</h3>
          <p>Ilosc utworów: ${playlist.tracks.total}</p>
        `);
        playlistList.append(playlistElement);
      });
    });
  }

  $('#sort-select').on('change', displayUserPlaylists);

  $('#sort-order-button').on('click', function() {
    ascendingOrder = !ascendingOrder;
    displayUserPlaylists();
  });

  displayUserInfo();
  displayUserPlaylists();
});
