var generators = require('yeoman-generator')

module.exports = generators.Base.extend({
    constructor : function(){
        // this指向
        generators.Base.apply(this, arguments);

        // 添加选项
        this.option('coffee');
    },
    // 给用户展示选项提示
    prompting: {
        // 创建目录
        dir: function(){
            // 判断输入的是否有值
            if(this.options.createDirectory !== undefined) return true

            // 回调状态
            var done = this.async()

            // 输入的类型，字段，提示
            var prompt = [{
                type: 'comfirm',
                name: 'createDirectory',
                message: '您要创建一个新的项目吗？'
            }]

            // 异步返回
            this.prompt(prompt, function(response){
                this.options.createDirectory = response.createDirectory

                done()
            }.bind(this))
        },
        // 目录名称
        dirname: function(){
            if (!this.options.createDirectory || this.options.dirname) {
                return true
            }

            var done = this.async();
            var prompt = [{
                type: 'input',
                name: 'dirname',
                message: '请输入目录名称'
            }]

            this.prompt(prompt, function (response) {
            this.options.dirname = response.dirname
                done()
            }.bind(this))
        },
        // 版本号
        version: function(){
            // 判断输入的是否有值
            if(this.options.version !== undefined) return true

            var done = this.async();
            var prompt = [{
                type: 'input',
                name: 'version',
                message: '请输入版本号'
            }]

            this.prompt(prompt, function (response) {
            this.options.version = response.version
                done()
            }.bind(this))
        },
        // 作者
        author: function(){
            if(this.options.author !== undefined) return true

            var done = this.async();
            var prompt = [{
                type: 'input',
                name: 'author',
                message: '请输入作者'
            }]

            this.prompt(prompt, function (response) {
            this.options.author = response.author
                done()
            }.bind(this))
        },
        // 描述
        description: function(){
            if(this.options.description !== undefined) return true

            var done = this.async();
            var prompt = [{
                type: 'input',
                name: 'description',
                message: '描述'
            }]

            this.prompt(prompt, function (response) {
            this.options.description = response.description
                done()
            }.bind(this))
        }
    },
    writing: {
        buildEnv: function(){
            // 创建目录
            if(this.options.createDirectory){
                this.destinationRoot(this.options.dirname);
                this.appname = this.options.dirname;
            }
        },
        allFile: function(){
            this.bulkDirectory('./bin', this.destinationPath() + '/bin')
            this.bulkDirectory('./bulid', this.destinationPath() + '/bulid')
            this.bulkDirectory('./src', this.destinationPath() + '/src')
            this.bulkDirectory('./test', this.destinationPath() + '/test')

            this.fs.copyTpl(
                this.templatePath('.babelrc'),
                this.destinationPath('.babelrc')
            )

            this.fs.copyTpl(
                this.templatePath('.eslintrc'),
                this.destinationPath('.eslintrc')
            )

            this.fs.copyTpl(
                this.templatePath('nginx.conf'),
                this.destinationPath('nginx.conf')
            )

            this.fs.copyTpl(
                this.templatePath('README.md'),
                this.destinationPath('README.md')
            )
        },
        pkg: function(){
            this.fs.copyTpl(
                this.templatePath('package.json'),
                this.destinationPath('package.json'),
                {
                    name: this.options.dirname,
                    version: this.options.version,
                    author: this.options.author,
                    description: this.options.description
                }
            )
        },
        pm: function(){
            this.fs.copyTpl(
                this.templatePath('pm2.json'),
                this.destinationPath('pm2.json'),
                {
                    name: this.options.dirname,
                    cwd: this.destinationPath()
                }
            )
        }
    }
})
