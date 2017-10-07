############################################################
# Dockerfile to build Champion search container images
############################################################

FROM        node:boron
MAINTAINER  Oleksandra Fedorova
WORKDIR     /usr/src/app

RUN         mkdir /root/.ssh
RUN         echo "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEAoqonEGOi2qgHvvESCUDHQAaLg2nUWLdhKMRLUcKMjCkjuIbU\n/9ZKdd/1RX2UwtNofoJnJ9PtjuwQ7EQ9ouh2XZX49DYzbo+uzA8B9bJiIh0sPJIF\nwsjXVbwjCshRGxpiGBoEHHolmCrQhms4PDNzgSpe5oWIEdMgN7uQclE13eUGiyAo\nK1ScQEHT5y6V8Ze3/Q2B8h/knoy2Y99JKdK8JUpg6gvhiEoR41mZAbm2dD0Vayuk\nlJD56aEIXbXQOpY0kVE38lhPsK8buzEP51p2GZ8F8B7Te0VmbwWMNyqRe2VVScnN\nOr5sOtc+DYBFkSRL5cOVuajO5fKROySdQR+zGwIDAQABAoIBAAqzNKSgWTsW6IOH\n6g7PwwuUIqM/V+eKEIsU9ntnV8V0g1QFEofNudItLD4o95slOu9vdoepKixHnQld\np8xKjFa1oc22rwVr0Cy+I/vcgxYJYzqMxHI+seOC36865BLrVl6Nf427/zMWRedB\nsE5NeCCb/+gcCopZn/nqjaLncqqo5jUexIdb1FImfFbI56YBsMRestHU5UTVnleV\n889U/1S9xFBx67ETgYvx/7cUg60cycvdBXBsWDsWln1Tfg5+0SJJgmni2ZDeYNDp\nvJ1Kd+OdmMcp5rH/8cOldHdnqWB0YNyby0DmmOR9nHTcnV66JsDer6QyKN5cOqmt\nrgGs63ECgYEA15QbC3nwoJLpeorQMR9LTTTONAoJPg9U0nagJUOYXHueptDhI+Fc\nEL4rnrFlEanm9PlE758LHQLJdno95DsOqi9AF2x8At451wUn0NJzw60p9GU7BbKk\ni2lj2cwktQG6fHdVs+2BwP9nBSLEL/G1fZmgRgfJYKFeoBIOoPkByQkCgYEAwSom\ncmADvgnvRYLGaDYpGQIeN3zcF9Gde+9d776DI0kq7Abc8OZWx0eHqo7Js7e405/B\ndK4oS7548EDRzhHi5MH92GiRsC/Ahn14f7BNLmkLKlHIUWHbmW2ZI5w+aCMZ/jvw\nKHZl88r/GdTgpo5rGHcqHChLU2VZ+54MzMEVmAMCgYEAn4o/HZYny14OJh9XBhOH\n0eJzfDW1M1V7S6p4yDsnJcJi3keVZs1gKg/jDjVwe8sGXmOfbcqBGf43BFRhO2et\naatAPlWNzT2TBpsNJVCqVbTwaKsGLChR986OE+Athjt6PKTAK0FpFmCtaDKbiHPU\nAdjQsSMQGFA0TDgw1VaSyKkCgYBIQwFxBjRAMq09PsgEkkZboaw2K9KWYodcptZo\nasfaOnQBKiwbPsA1+q9pAdO5FMDjAj+367MNausJTeZvBcfwthXFkJD37VVDusqK\nUiT9eLSBl2it8ULaqeKBLOE3yfHeZwPXzzsisc0vF7EW/e5Yj7PEJtrPDvpTo/O7\n4Xu3iwKBgQCAl7up5K/Yc36ZuP1t+iDArHabuFE9dgK/F1XmYNnwbiEVU12iFxch\n8ern13wG2T6VE5wmShgqGd4Nu2bh2V4dZf0P3dAz2PUqrJHNZcqRVw8jKxoxVNW8\n+lTiOW0aQZYtnGpxnbsToJvKkNLJ+dWmtU4rUX40RHnk/6Z1VUTWeg==\n-----END RSA PRIVATE KEY-----" > /root/.ssh/id_rsa
RUN         chmod 700 /root/.ssh/id_rsa
RUN         touch /root/.ssh/known_hosts
RUN         ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN         ssh-agent bash -c 'ssh-add /root/.ssh/id_rsa'
RUN         git clone git@github.com:emoilenne/pandascore-technical-test.git .
RUN         npm install

EXPOSE      2020
CMD         ["npm", "start"]
