const app = angular.module('bucket_list_app', ['ngRoute', 'ngSanitize']);

app.controller('MainController', ['$http', '$scope', '$sce', function($http, $scope, $sce) {
  this.users = [];
  this.list_items = [];
  this.bucket_lists = [];
  this.formdata = {};
  this.user = {};
  this.goal = {};
  this.userPass = {};

  //server location
  this.url = 'http://localhost:3000';

  // log in function
  this.login = (userPass) => {
    console.log(userPass);
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: {
        user: {
          username: userPass.username,
          password: userPass.password,
          user_id: userPass.id
        }
      },
    }).then(response => {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
    });
}
    //see the secret content
    this.getUsers = () => {
      $http({
        url: this.url + '/users',
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(response => {
        console.log(response);
        if (response.data.status == 401) {
          this.error = "Unauthorized";
        } else {
          this.users = response.data;
        }
      });
    }

    //logout
    this.logout = ()=> {
      localStorage.clear('token');
      location.reload();
    }







  $http({
    method: 'GET',
    url: 'http://localhost:3000/list_items',
  }).then(response => {
    this.list_items = response.data;
    this.post = this.list_items.id;
  }).catch(reject => {
    console.log('reject: ', reject);
  });

  $http({
    method: 'GET',
    url: 'http://localhost:3000/bucket_lists',
  }).then(response => {
    this.bucket_lists = response.data;
  }).catch(reject => {
    console.log('reject: ', reject);
  });

  this.getAllPosts = () => {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/list_items',
    }).then(response => {
      this.list_items = response.data;
      this.user = this.bucket_lists.users
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.getAllPosts();

  this.getUser = (id) => {
    console.log(this.user);
    $http({
      url: "http://localhost:3000/users/" + id,
      method: "GET"
    }).then(response => {
      this.oneUser = response.data;
      console.log(this.oneUser);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.getOne = (id) => {
    $http({
      url: "http://localhost:3000/list_items/" + id,
      method: "GET"
    }).then(response => {
      this.oneGoal = response.data;
      console.log(this.oneGoal);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.deleteOne = (id) => {
    $http({
      url: "http://localhost:3000/bucket_lists/" + id,
      method: "DELETE"
    }).then(response => {
      console.log(this.bucket_lists);
      this.bucket_lists.splice(response.data, 1);
    }).catch(reject => {
      console.log('reject: ', reject);
    });
  }

  this.createPost = (post_id, user_id) => {
    console.log("post id: " + post_id + " user id: " + user_id);
    this.newBucket = {
      user_id: user_id,
      list_item_id: post_id
    };
    $http({
      method: 'POST',
      url: "http://localhost:3000/bucket_lists",
      data: this.newBucket
    }).then(response => {
      console.log(this.newBucket);
      console.log(response.data);
      this.bucket_lists.push(response.data)
      console.log(this.bucket_lists);
    }).catch(error => {
      console.log('error:', error);
    });
  }


  this.processForm = () => {
    $http({
      method: 'POST',
      url: "http://localhost:3000/list_items",
      data: this.formdata
    }).then(response => {
      this.post = response.data;
      this.list_items.push(this.post);
      this.createPost(this.post.id, this.user.id)
      this.getAllPosts();
    }).catch(error => {
      console.log('error:', error);
    });
  }

}]);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  $routeProvider.when("/", {
    templateUrl: "../partials/home.html"
  })

  $routeProvider.when("/profile", {
    templateUrl: "../partials/profile.html"
  })

  $routeProvider.when("/goal/:id", {
    templateUrl: "../partials/one_goal.html"
  })

  $routeProvider.when("/user/:id", {
    templateUrl: "../partials/user.html"
  })

}]);
