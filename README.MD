# Ng-rest-api
**Ng-rest-api** - is a rest api provider for angular for http actions request to server and instantiate models.
Ng-rest-api use ngResource. That simplifies common GET, POST, DELETE, and UPDATE requests.
Also you can easy read **headers**. 
And, of course, if you need - u can get plain text response (It is sometimes convenient, but do not overdo it)

## Add to project

Download ng-rest-api.min.js manually or install with bower or npm.

```bash
$ bower install ng-rest-api --save
```
or
```bash
$ npm install ng-rest-api --save
```

Include **ng-rest-api.min.js** in your website.

```html
<script src="bower_components/ng-rest-api/ng-rest-api.min.js"></script>
```

Set **ng-rest-api** as a dependency in your module

```javascript
var app = angular.module('app', ['ng-rest-api']);
```

## Config

Create config for **ng-rest-api** (configure apiProvider).
Describe endpoints and http Actions.
You need set Model (as **class/function** or as **string (angular factory)**)
If you would like read headers, just set **headersForReading** (Response will array, where second parameter it will 
headers object).

**Small note** 
All endpoints has default actions:
 *  **.get()** - GET
 *  **.update()** - PUT
 *  **.save()** - POST
 *  **.patch()** - PATCH
 *  **.remove()** - DELETE


### Config example
```javascript
import Post from './models/Post';

function config(apiProvider, API_URL) {
    "ngInject";

    apiProvider.setBaseRoute(API_URL);

    apiProvider.endpoint('dictionaryWord')
        .route('post/:id')
        .model(Post) // **if u pass model as angular factory u need type string 'Post' (service name) - See below**
        .addHttpAction('GET', 'query', {isArray: true, headerForReading: 'X-Total-Count', params: {limit: 25}})
        .addHttpAction('PATCH', 'patch', {params: {id: '@id'}});
        
     // **** OTHER ENDPOINTS 
}

	// REGISTER CONFIG
    angular.module('app')
        .config(config);
```

### Model examples

#### ES6 class
```javascript
class Post {
    constructor({id, short_description, full_description}) {
        this.id = id;
        this.short_description = short_description;
        this.full_description = full_description;
    }
}

export default Post;
```

#### As angular service with DI
ES5 (may ES6 class, just example)
```javascript
angular
   .module('app')
   .factory('Post', Post);
        
/** @ngInject */
function Post($log, $otherDependency) {

   function PostModel(resource) {
       resource = resource || {};
       this.id = resource.id || null;
       this.short_description = resource.short_description || '';
       this.full_description = resource.full_description || '';
   }

   return PostModel;
}
```

## Send request to server:
Please DON'T use controller for this :)
Use managers (services).

**Usage** - inject api. Then, request  - *api.endpoint.method* (e.g. **api.post.query()**)

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

## Component / Controller
Api endpoints actions always return promise: 

```javascript
import template from './post-list.html';

class PostListController {
    constructor(PostManager) {
        "ngInject";
        this._PostManager = PostManager;
        this.posts = [];
        this.headers = {};

        this._activate();
    }

    _activate() {
        this._PostManager.query()
            .then(([posts, headers]) => {
            	this.headers = headers;
                return this.posts = posts;
            });
    }
}

export default {
    template: template,
    controller: PostListController
};
```