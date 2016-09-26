import api from './../src/index';

angular
    .module('app', ['ng-rest-api'])
    .config((apiProvider)=> {
        apiProvider.setBaseRoute('http://mock.local/api/');
        apiProvider.setCacheDefaultLifetime(1000);

        apiProvider.endpoint('course')
            .route('courses/:id')
            .addHttpAction('GET', 'query', {
                isArray: true,
                $cache: {lifetime: 2000},
                headersForReading: ['x-total-count'],
                params: {limit: 10}
            })
            .addHttpAction('PATCH', 'patch', {params: {id: '@id'}})
            .addHttpAction('DELETE', 'remove', {params: {id: '@id'}})
        ;
    })
    .controller('app', (api, $interval)=> {
        let counter = 0;
        $interval(() => {
            api.course.query().then(r => console.log(r));

            if(counter === 3 ) {
                // api.course.query.$cache.setLifetime(7000);
            }

            if(counter > 5) {
                // api.course.query.$cache.clear();
            }

            counter++;
        }, 2000);
    });