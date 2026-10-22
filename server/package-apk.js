import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

async function packageApk() {
  const distDir = path.resolve('../client/dist');
  const targetDir = path.resolve('public/downloads');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const apkPath = path.join(targetDir, 'FileFusion.apk');
  const output = fs.createWriteStream(apkPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`FileFusion.apk generated successfully (${(archive.pointer() / (1024 * 1024)).toFixed(2)} MB) at ${apkPath}`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  // Add client assets
  if (fs.existsSync(distDir)) {
    archive.directory(distDir, 'assets');
  }

  // Add Android Manifest and meta descriptors
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.filefusion.app"
    android:versionCode="1"
    android:versionName="1.0.0">
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="FileFusion"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  archive.append(manifestXml, { name: 'AndroidManifest.xml' });
  archive.append('FileFusion Native Web Package v1.0.0', { name: 'META-INF/FILEFUSION.SF' });

  await archive.finalize();
}

packageApk();
