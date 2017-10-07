import time
import json

def get_popularity_data(matches, timeperiod):
    print "Getting popularity data... "
    popularity_dates = {}
    min_date = None
    max_date = None
    all_champions = []
    for match_index in range(len(matches)):
        match = matches[match_index]
        date = int(match['timestamp'] / (timeperiod * 86400))
        if not (match['champion'] in all_champions):
            all_champions.append(match['champion'])

        if not min_date or date < min_date: min_date = date
        if not max_date or date > max_date: max_date = date

        if not (date in popularity_dates):
            popularity_dates[date] = { 'total': 0}

        if not (match['champion'] in popularity_dates[date]):
            popularity_dates[date][match['champion']] = 0

        popularity_dates[date][match['champion']] += 1
        popularity_dates[date]['total'] += 1

    for date in popularity_dates:
        for champion in popularity_dates[date]:
            if champion != 'total':
                # round to 2 decimal digits
                popularity_dates[date][champion] = popularity_dates[date][champion] * 100. / popularity_dates[date]['total']
                popularity_dates[date][champion] = round(popularity_dates[date][champion] * 100) / 100.

        del popularity_dates[date]['total']

    # restructure data so we can easily extract it for one champion

    popularity_champions = {}
    for champion in all_champions:
        popularity_champions[champion] = []
        for date in range(min_date, max_date + 1):
            formatted_date = time.strftime('%b %Y', time.localtime(date * timeperiod * 86400))
            if not (date in popularity_dates and champion in popularity_dates[date]):
                popularity_champions[champion].append({'date': formatted_date, 'popularity': 0})
            else:
                popularity_champions[champion].append({'date': formatted_date, 'popularity': popularity_dates[date][champion]})
    print "done."
    return popularity_champions


def get_roles_data(matches):
    print "Getting roles data... "
    roles_data = {}
    for match_index in range(len(matches)):
        match = matches[match_index]
        champion = match['champion']
        if not (champion in roles_data):
            roles_data[champion] = {'total': 0}

        if not (match['role'] in roles_data[champion]):
            roles_data[champion][match['role']] = 0

        roles_data[champion][match['role']] += 1
        roles_data[champion]['total'] += 1

    # extract percentage
    roles_data_raw = {}

    for champion in roles_data:
        for role in roles_data[champion]:
            if role != 'total':
                roles_data[champion][role] = roles_data[champion][role] * 100. / roles_data[champion]['total']
        del roles_data[champion]['total']

        roles_data_raw[champion] = []
        for role in roles_data[champion]:
            # round to 1 decimal digit
            roles_data_raw[champion].append({'role': role.title().replace('_', ' '), 'data': round(roles_data[champion][role] * 10) / 10.})

        roles_data_raw[champion].sort(key=lambda a: a['data'], reverse=True)

    print "done."
    return roles_data_raw

def get_champions_data(champions):
    print "Getting champions data... "
    champions.sort(key=lambda a: a['name'])
    print "done."
    return champions

if __name__ == '__main__':
    with open('data.json') as json_data:
        data = json.load(json_data)
        roles_data = get_roles_data(data['matches'])
        with open('public/data/roles_data.json', 'w+') as roles_data_file:
            json.dump(roles_data, roles_data_file)

        # track every 10 days
        popularity_data = get_popularity_data(data['matches'], 10)
        with open('public/data/popularity_data.json', 'w+') as popularity_data_file:
            json.dump(popularity_data, popularity_data_file)

        champions_data = get_champions_data(data['champions'])
        with open('public/data/champions_data.json', 'w+') as champions_data_file:
            json.dump(champions_data, champions_data_file)
