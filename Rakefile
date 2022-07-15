require 'rake'
require 'confidante'

configuration = Confidante.configuration

task :default do
  Rake::Task[:'check:all'].invoke
  Rake::Task[:'test:all'].invoke
end

namespace :app do
  namespace :dependencies do
    desc "Install dependencies required to build the app"
    task :install do
      puts("Installing NPM dependencies defined in package.json")
      sh('yarn install')
    end
  end

  task :start do
    deployment_type = 'local'
    deployment_label = 'development'

    runtime_configuration = configuration
                              .for_scope(
                                role: 'app',
                                deployment_type: deployment_type,
                                deployment_label: deployment_label)
                              .environment
                              .to_h
                              .map{ |k, v|
                                "#{k.to_s}=#{v.to_s}"}
                              .join(' ')

    sh("#{runtime_configuration} yarn start")
  end

  task :dev do
    deployment_type = 'local'
    deployment_label = 'development'

    runtime_configuration = configuration
                              .for_scope(
                                role: 'app',
                                deployment_type: deployment_type,
                                deployment_label: deployment_label)
                              .environment
                              .map { |k, v| [k.to_s, (v.kind_of?(Array) || v.kind_of?(Hash)) ? JSON.generate(v) : v] }
                              .to_h

    sh(runtime_configuration, "yarn dev")
  end
end

namespace :check do
  task :lint => [:'app:dependencies:install'] do
    sh('yarn lint')
  end

  task :all do
    Rake::Task['check:lint'].invoke
  end
end

namespace :test do
  task :component => [:'app:dependencies:install'] do
    sh('yarn test-component')
  end

  task :all do
    Rake::Task['test:component'].invoke
  end
end
