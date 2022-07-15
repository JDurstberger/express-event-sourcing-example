task :default do
  Rake::Task[:'check:all'].invoke
  Rake::Task[:'test:all'].invoke
end

namespace :check do
  task :lint do
    sh('yarn lint')
  end

  task :all do
    Rake::Task['check:lint'].invoke
  end
end

namespace :test do
  task :component do
    sh('yarn test-component')
  end

  task :all do
    Rake::Task['test:component'].invoke
  end
end
