require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'ZeeguuShield'
  s.version = package['version']
  s.summary = package['description']
  s.license = package['license']
  s.homepage = 'https://zeeguu.org'
  s.author = package['author']
  s.source = { :git => 'https://github.com/zeeguu/web.git', :tag => s.version.to_s }
  s.source_files = 'ios/Sources/**/*.swift'
  s.ios.deployment_target = '14.0'
  # The Screen Time frameworks need iOS 16; weak-linked so the app still runs on 14.
  s.weak_frameworks = 'FamilyControls', 'ManagedSettings', 'DeviceActivity'
  s.dependency 'Capacitor'
  s.swift_version = '5.1'
end
