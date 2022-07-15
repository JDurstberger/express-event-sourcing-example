require 'rake'

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
