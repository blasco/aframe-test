rm -rf www
ng build --outputPath=www
firebase deploy -P flinto-vr --only hosting                                                                                                                                                        
