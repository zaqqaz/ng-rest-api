**ng-rest-api** is a rest api provider for angular for http actions request to server and instantiate models.

## Usage

Download ng-rest-api.min.js manually or install with bower or npm.

```bash
$ bower install ng-rest-api
```
or
```bash
$ npm install ng-rest-api
```

Include **ng-rest-api.min.js** in your website.

```html
<script src="bower_components/ng-rest-api/ng-rest-api.min.js"></script>
```

Set **ng-rest-api** as a dependency in your module

```javascript
var app = angular.module('app', ['ng-rest-api']);
```

Create config for **ng-rest-api** (configure apiProvider):

```javascript
import Post from './models/Post';

function config(apiProvider, API_URL) {
    "ngInject";

    apiProvider.setBaseRoute(API_URL);

    apiProvider.endpoint('dictionaryWord')
        .route('post/:id')
        .model(Post)
        .addHttpAction('GET', 'query', {isArray: true})
        .addHttpAction('PATCH', 'patch', {params: {id: '@id'}});
        
     // **** OTHER ENDPOINTS 
}

// REGISTER CONFIG
angular.module('app').config(config);
```

## Send request to server from manger:

```javascript
class PostManager {
    constructor($log, api) {
        "ngInject";
        
        this.api = api;
    }

    query(queryParams = {}) {
        return this.api.post.query(queryParams);
    }

    getById(id) {
        return this.api.post.get({id: id});
    }

    save(post) {
        return (post.id) ? this.api.post.patch(post) : this.api.post.save(post);
    }
}

export default PostManager;
```

## Get data in controller
Api endpoints actions always return promise: 

```javascript
import template from './post-list.html';

class PostListController {
    constructor(PostManager) {
        "ngInject";
        this._PostManager = PostManager;
        this.posts = [];

        this._activate();
    }

    _activate() {
        this._CourseManager.query()
            .then((posts) => {
                return this.posts = posts;
            });
    }
}

export default {
    template: template,
    controller: PostListController
};
```