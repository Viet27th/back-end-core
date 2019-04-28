========Source Structure========
https://stackoverflow.com/questions/23989232/is-there-a-way-to-represent-a-directory-tree-in-a-github-readme-md
.
├── app.js
├── bin
│   └── www
├── controllers
│   └── api.users.js
├── document.md
├── middleware
│   ├── api_users.js
│   └── index.js
├── models
│   ├── plugins
│   │   └── example.js
│   └── users.js
├── package-lock.json
├── package.json
├── private.key
├── public.key
├── routes
│   └── api_users.js
├── seeds
│   └── fake_user.js
└── services
    ├── db_connector
    │   ├── index.js
    │   └── plugins
    │       └── paginate.js
    ├── jwt.js
    └── regular-expression.js
    
=====================================================================

* app.js
* bin
    * www
* controllers
    * api.users.js
* middleware
Folder này báo toàn bộ middleware sử dụng cho các router. Chỉ require 1 file index.js.
    * index.js
    Viết các middleware chung trong file này. Ngoài ra có thể Import các middleware, cái mà chỉ sử dụng cho từng model.
    * models
        * users.js
        User model: Trong file này bao gồm Schema Instance cho User collection trong Mongoose và export một Model Class (Dạng function class).
        Có thể đăng ký các hook, statics, methods cho riêng User Schema Instance trong này. Khi User Schema Instance được
        tạo ra, có thể đăng ký plugin cho nó. Plugin là một hàm sẽ chạy khi một Schema Instance hay một Mongoose Instance 
        đăng ký sử dụng nó. Với trường hợp là Schema Instance, nó là local plugin. Với Mongoose Instance, nó là một global 
        plugin. Plugin là nơi tốt để viết Hook, statics, methods cho Model Instance.
        Ví dụ: User Schema Instance sử dụng 1 plugin bằng cách userSchema.plugin(examplePlugin); Khi này examplePlugin là 1 hàm
        gồm 2 tham số là "schema" và "options". Tham số "schema" khi này đang refer đến là User Schema Instance. Vậy khi 
        viết các Hook, statics, methods bên trong hàm examplePlugin như schema.statics hay schema.pre hay schema.methods thì 
        nó sẽ chỉ tác động lên userSchema.
        schema.statics: đăng ký 1 phương thức cho Model Class trong khi schema.methods đăng ký 1 phương thức cho Document Instance
        Model Class như đã export ở trên. Document Instance hiện tại có 2 cách để tạo ra là Query ko dùng lean() sẽ trả về một Document Instance
        thay vì một Plain Object. Hoặc new một Model Class.
        
        * Plugins
        Thư mục này sẽ chứa các local plugins. Chỉ Schema Instance nào cần dùng thì sẽ require plugin tương ứng.
    
    * routes
    Thư mục này định nghĩa router cho cả app.
        * api_users.js
        Thư mục này chứa router tương ứng với model user.
    * seeds
    Folder này dành cho mook data.
        * fake_user.js
        Tạo data đầu tiên super admin.
    * service
    Folder cung cấp các module tiện ích cho app.
        * db_connector
        Khởi tạo connect đến database => trả về "Connection Instance" là "mongoose" object.
            * plugins
            Folder này chứa global plugin. Chỉ "mongoose" object được dùng plugin này. Hook, statics, methods trong plugin
            này sẽ ảnh hưởng đến toàn bộ các Model Class.
        
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Scenario login and refresh login: 
Refer https://stackoverflow.com/questions/26739167/jwt-json-web-token-automatic-prolongation-of-expiration
https://gist.github.com/soulmachine/b368ce7292ddd7f91c15accccc02b8df
https://kipalog.com/posts/Authentication-nang-cao-trong-SPA--Vue-React--dung-JWT-ket-hop-Cookie
Khi người dùng vào trang chủ web, một request đến /api/user/refresh-token.
Nếu trong cookie có chứa token và token này chưa hết hạn thì sẽ set 1 cookie mới với token mới. Nếu ko có cookie hoặc
token trong cookie đã hết hạn thì sẽ ko làm gì cả.
Khi login sẽ đc set cookie token. Thời gian hết hạn của token = với time hết hạn của cookie. Nếu gọi các request cần 
xác thực mà ko có cookie hay token đã hết hạn sẽ nhắc nhở login. Nếu ko cào trang chủ sau 1 tuần sẽ bị hết hạn token.
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

