require 'rake'
require 'confidante'
require 'rake_docker'

configuration = Confidante.configuration

task :default do
  Rake::Task[:'check:all'].invoke
  Rake::Task[:'test:all'].invoke
end

task :clean do
  sh('yarn clean')
end

namespace :app do
  namespace :dependencies do
    desc "Install dependencies required to build the app"
    task :install do
      puts("Installing NPM dependencies defined in package.json")
      sh('yarn install')
    end
  end

  task :compile => [:'app:dependencies:install'] do
    sh('yarn compile')
  end

  task :start => [:'app:compile', :'database:local:provision'] do
    deployment_type = 'local'
    deployment_label = 'development'

    environment = configuration
                    .for_scope(
                      role: 'app',
                      deployment_type: deployment_type,
                      deployment_label: deployment_label)
                    .environment
    write_env_file(environment)
    sh("yarn start")
  end

  task :dev => [:'app:dependencies:install', :'database:local:provision'] do
    deployment_type = 'local'
    deployment_label = 'development'

    environment = configuration
                    .for_scope(
                      role: 'app',
                      deployment_type: deployment_type,
                      deployment_label: deployment_label)
                    .environment
    write_env_file(environment)
    sh("yarn dev")
  end
end

namespace :check do
  task :lint => [:'app:dependencies:install'] do
    sh('yarn lint')
  end

  task :format => [:'app:dependencies:install'] do
    sh('yarn format')
  end

  task :all do
    Rake::Task['check:format'].invoke
    Rake::Task['check:lint'].invoke
  end
end

namespace :database do
  namespace :local do
    RakeDocker.define_container_tasks(
      container_name: 'eese-service-local-database') do |t|
      configuration = configuration
                        .for_scope(
                          deployment_type: 'local',
                          deployment_label: 'development')

      t.image = "postgres:#{configuration.database_version}"
      t.ports = ["#{configuration.database_port}:5432"]
      t.environment = [
        "POSTGRES_DB=#{configuration.database_name}",
        "POSTGRES_PASSWORD=#{configuration.database_password}",
        "POSTGRES_USER=#{configuration.database_user}"
      ]
    end
  end
  namespace :test do
    RakeDocker.define_container_tasks(
      container_name: 'eese-service-test-database') do |t|
      configuration = configuration
                        .for_scope(
                          deployment_type: 'local',
                          deployment_label: 'testing')

      t.image = "postgres:#{configuration.database_version}"
      t.ports = ["#{configuration.database_port}:5432"]
      t.environment = [
        "POSTGRES_DB=#{configuration.database_name}",
        "POSTGRES_PASSWORD=#{configuration.database_password}",
        "POSTGRES_USER=#{configuration.database_user}"
      ]
    end
  end
end

namespace :test do
  task :unit => [:'app:dependencies:install'] do
    sh('yarn test-unit')
  end

  task :integration, [:deployment_type, :deployment_label] => [:'app:dependencies:install'] do |_, args|
    puts args
    args.with_defaults(
      deployment_type: 'local',
      deployment_label: 'testing')

    configuration = configuration
                      .for_scope(args.to_h.merge(role: 'test'))
    environment = configuration
                    .environment
                    .to_h

    if configuration.database_deployment_type == 'local'
      Rake::Task['database:test:provision'].invoke
    end

    write_env_file(environment, '.env-test')
    sh('yarn test-integration')
  end

  task :component, [:deployment_type, :deployment_label] => [:'app:dependencies:install'] do |_, args|
    args.with_defaults(
      deployment_type: 'local',
      deployment_label: 'testing')

    configuration = configuration
                      .for_scope(args.to_h.merge(role: 'test'))
    environment = configuration
                    .environment
                    .to_h

    if configuration.database_deployment_type == 'local'
      Rake::Task['database:test:provision'].invoke
    end

    write_env_file(environment, '.env-test')
    sh('yarn test-component')
  end

  task :all, [:deployment_type, :deployment_label] do |_, args|
    args.with_defaults(
      deployment_type: 'local',
      deployment_label: 'testing')

    Rake::Task['test:unit'].invoke
    Rake::Task['test:integration'].invoke(*args)
    Rake::Task['test:component'].invoke(*args)
  end
end

def env_value_to_string(v)
  (v.kind_of?(Array) || v.kind_of?(Hash)) ? JSON.generate(v) : v.to_s
end

def write_env_file(environment, filename = '.env')
  contents = environment
               .to_h
               .map { |k, v| "#{k.to_s}=#{env_value_to_string(v)}" }
  File.open(filename, 'w') { |file|
    contents.each { |line| file.puts(line) }
  }
end
