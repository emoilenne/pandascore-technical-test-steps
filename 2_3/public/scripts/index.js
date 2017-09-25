function search() {
  searchBar = document.getElementById('searchBar');
  var query = searchBar.value.trim().toLowerCase();
  // search_results = []
  // for (var i = 0; i < champions.length; i++) {
  //   if (champions[i]['name'].indexOf(query) != -1) {
  //     search_results.push(champions[i]);
  //   }
  // }
  var champions = document.getElementsByClassName('champion');
  for (var i = 0; i < champions.length; i++) {
    var name = champions[i].getElementsByTagName('center')[0].innerHTML;
    if (!query || name.toLowerCase().indexOf(query) != -1) {
      champions[i].style.display = "";
    } else {
      champions[i].style.display = "none";
    }
  }
}
