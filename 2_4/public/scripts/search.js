function search() {
  $.getJSON('/data/champions_data.json', function(champions_data) {
    searchBar = document.getElementById('searchBar');
    var query = searchBar.value.trim().toLowerCase();

    var champions = document.getElementsByClassName('champion');
    var roles = document.getElementsByClassName('checkbox');

    // should search if we have some query or any checkbox is on
    var should_search = query
    for (var role_index = 0; role_index < roles.length; role_index++) {
      should_search = should_search || roles[role_index].checked;
    }

    if (!should_search) {
      for (var champion_index = 0; champion_index < champions.length; champion_index++) {
        champions[champion_index].style.display = "";
      }
      return;
    }

    // check query
    for (var champion_index = 0; champion_index < champions.length; champion_index++) {
      var name = champions[champion_index].getElementsByTagName('center')[0].innerHTML;

      if (!query || name.toLowerCase().indexOf(query) != -1) {
        champions[champion_index].style.display = "";
      } else {
        champions[champion_index].style.display = "none";
      }
    }

    // check checkboxes
    for (var role_index = 0; role_index < roles.length; role_index++) {
      if (roles[role_index].checked) {
        for (var champion_index = 0; champion_index < champions.length; champion_index++) {
          if (!(champions_data[champion_index]['tags'].includes(roles[role_index].id))) {
            champions[champion_index].style.display = "none";
          }
        }
      }
    }
  });
}
