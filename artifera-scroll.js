/* ===== ARTIFERA SCROLL-ASSEMBLE: particles form the logo as you scroll, then release ===== */
(function () {
  'use strict';

  /* ---------- EDIT EVERYTHING HERE ---------- */
  const CONFIG = {
    section: { heightVh: 500 },
    shape: {
      src: 'assets/artifera_logo.jpeg',          // logo image (sampled to dots)
      inlineFallback: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAYGBgYHBgcICAcKCwoLCg8ODAwODxYQERAREBYiFRkVFRkVIh4kHhweJB42KiYmKjY+NDI0PkxERExfWl98fKcBBgYGBgcGBwgIBwoLCgsKDw4MDA4PFhAREBEQFiIVGRUVGRUiHiQeHB4kHjYqJiYqNj40MjQ+TERETF9aX3x8p//CABEIAbABsAMBIgACEQEDEQH/xAAwAAEAAgMBAQAAAAAAAAAAAAAABQYCAwQBBwEBAQEBAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAACqgAAAAAAABLkR7dZooMpbxX++RGjd6APNO8RvHPCoRX0QfK/PqUGUlMRB4AAAAAAAAAAAAAAWAgrHatpy9QAAADxPQAoAADl6hTq99S0HzFYa+eAAAAAAAAAAAdkndDgkQAPNSbvIqK1LLzVrbZK87rtj8ZnaQWU6WG2yWBz9OjSSu2FzzZdxdUZiAEbJD5vxfVKWV8AAAAAAAA9Ft6J8AGpNuiIiNSUipCZ1IGWk8s3n3ZM08wXY59NncjsSTRu47GjdHmvcODVKY6vJ1a9Udjn3x6ACtVD6pBFHe+AAAAAAHt202QAPImzqrOEzvMZY+nZm+evM6985tFdHJs6Kik3kQecyIbyaSQOiyqqWNvwK3JbYmywbqXJxYfNO/N049GKsteRkACBpP1StFPAAAAAsEZ9IAGPsBc+xC1bzrkDns81q1btladxAABjkAGOQABhEzJKdJTlf3J7bTbLHbjkzrz3wegApVf+qfODiAAA98sRYJMBHJzQXlq6Yy7Dnt574uOYAMM4cldcRKQ5d2mo+b05jxiQtiw3GxwbDraN4ABwVy5abOGUqEtZM+es6AARskPlSwV8AAz+l1S5A8NNQkMOnOSl8csaCaAAc/RWiU21vsJnPTqjj3bd5hjujDb0xssa/e3lNvLn0VET3HidwAANdSuOmyPlqZZrO0Z0ABq+ZfUqgVkD3yYLp0g4e2qazx2+Jn0DOwABgRsJ0YGrXu8Nk3AdhvRmJY9nnPHVnryqMgrPGEzq99MMdHTHvVHbKkwAAcNduFf1mdzgZ6UJQHN0j5Ul4gXalfUTMHFVpHLpznN5z2CgAIuUrxzAY5DU9xJXo5us95eDMndcdLGnL3WedFbmSNkt2+OTfhmdQoABjkKbaeDj3iyDGwAICk/T/mJI/Q6hbxq28FzWLRWLjrOwY6AAAKxZ6wYPPQDzRv1HRKQvaYcs1rNuUNH1buOu9omcNsY5x+8kI3u5CZAAABhUbjXLme2xcooSgPnf0SoEjPR0iICeqmsbLRDzAGdgAAISbiSHzxzAPNWzWa4+Sjhnh0aiQldssTwTHUVSxRvDZassdubzyWjrAAAAHB34pWrPUbXqZjOgEBPxp17/AD0wp9up+8Wfu5+jNCaAAHhqru7nAHnmA89HkdI8BhPQNm02ad2WWndKV866xY67U/08EtHFN69gAAAABU7JBS2sd4zsBo3+HoNFStlT3zt+3XsxsFAARskKoloeMxWoA8HD3cBhLw+3UtGvVLZsRvyxPaz0cekjb6rIpNjNAAAAAgOrRnrEyM7AA895uk56jb6fvnctujfjQNAAAcEHaK3GArXjs1gCP6+A99xz1Pd2nzTq06vR2cmWk/q4JzKXHOgAAAAQeWrp1iWGdgPPdByyMBPmqnXSn752jqjpHOgmgB4eubA7ImWxKu88GtpN3Py7E1OjX1YvFHvnM8D3zs7o026uTkdAUA8HoAAK3KQli1npGdAI2SgCPt/zz6GKvaIbWMZuq2k9GdqvaOcpOFl5SKj5/aWbHMU7nvApHfaREyeYwqdv5dSjZPD33Zb82GnekeegAAB8+9kt5GdkviaZ+KlRjlxJXLbWbTqBnQCn3D52R/1D5ddye5erFKdbqpO9MSY59AEFNUI3XnR0Dg7quWj2l3A2AAAqEdaOYlO0AAADytFmUa4m2iX7kKPf6BfjaBXp+nWTcxo3gSgafmN0pQl4gfVXN0kHH2WndOd394+znsFaN4cnRQj238VbLJAyMYX1hXCzOXqAPMNgAAGk3a4WSKr1SPcRPPD5n0BESxwd/oGJFxvLZt57BjQA5CmRHvgBZrf8t+mm2uWPnuYCzUyy6neMbAR8gFEvfz8nJzoHkBYOY+fSGu4nPJcHITeVakCUxovhdttOuRT+C3dJB2Ss4ll+c/S60SuVcuJWLHsACDkKxrMhY9W2UJQFNtfzQwAAsFfH1VHSJDQ9uq28WfbWrHm5CaPPRy9QAVez/Pyw2DVtFXtFKJuZ4cjbz0iWJuVq9lIiq3qjlllanwF/2xcoRcoADVlVLNNi5puwM6AEaV6u++AAAHb9H+Vz5dufoJSZzsq/TF2RUrjbz3yX1hmAOTrACg36POrHo8KPeYKdAEfICJlfQAA16arZ0duyasevM69AA+byUAAAAAAXCy/K7uTsdIkpU701fpm7e1+dxc9W1NYZ6dddTVtgAAAAAAAxjUk4eI6tTgsXbuPPfMc69yABWeikngAAAAAHvgvE78rt5ZeTrJT91mhemZXppctLPYYbsXk1SGNvLv1clSnsKJpEZxKIvxJVDaSf8rHPVniuKRshemxdEcfawzc9evK33Y9gBAc9SHgAAAAAAAAT9z+W9p9IRskcdetuOs0ya7IjUn99M6M21ojul6NWz2OTTJKiPJhUTtkUcm/PEy959B3aeLO3PLbujHMgRxI0mN4gAAAAAAAAAAD2wV4fTej5bYS4ubpNEZNLKppuGNlU3WDRUbt3Y156yMMOrdLGJjYRPZ2ey69hkOM7Oer10na+AAAAAAAAAAAAAAHsvDi7Tny30+qPncqW9A9pItG49AeaTejuEn1Qij6BC0nwl4gAAAAAAAAP/8QAAv/aAAwDAQACAAMAAAAhAAAAAAAAMMAgQAggQEAAAAAAAAAAAAAAAMgAAAAFBAAAAQkIAAAAAAAAAAAQAALVfgJUJ9uAAAQIAAAAAAAAAQAFG5JiEFHLLzkeMAAgAAAAAAAYAECYgY2SwjB0FDb2GAAEAAAAAAABRCIAAAAIAIAAj9JQEAAIAAAAAGdiQgAE+EM4UAIAASmQAAQoAAYARpAAAQsOCiW2ggAAAwCAAAQAAgAiAAAA0oUkSwQMWwAAAFAAAAoQAIjAAAUAAY0Yc8oCOAAAAFAAAIARXAAAAQIAMA4Uk4w8AAAAnAAAQAZpAAAAQ4AkI1sctQQAAAATkAAAA0gAAAAcAYQ+I8A2GgAAAAA/AAEA2CAAAQ2AgEsZuUkDAAAAAATAAAoerAAAAaA08kBzPSAAAAAAATAAQI5KAAEEAIQNZa7/AD8wADAAAPgAEAERQFBBIMIMB5SEIAAAMNAF4QABEEhAACABBAAAPIAAADAJJAFqAACFCMAgEFEGACAIAABEGCDEBFAABIAKAogAEBEEGECMJNIMGEABaAAGAAFAKjgCEAGCFFNFMJKIAHEgAAAAAAFA9SACAEABEAAEIAAFlpAACAAAAAIEljwACAAAAAAADywZIAEAAAAAAABA+TG4MoijywEbx3CACAAAAAAAAAMCEcTjhw8YsKcngAAAAAAAAAAAAAEJCEm0mMQn6IBHEAAAAAAAAAAAAAAAICABACBBIMAAAAAAAAP/xAAC/9oADAMBAAIAAwAAABDzzzzzzzzyQzyzyyxzTDzzzzzzzzzzzzzzxxzzzjf/AO888sM488888888888oc84rXtosArmx88sY888888888c8//GeNa3y45tNH688o8888888U8tYn8iDPMP8ALhuNS0PPLPPPPPJPM739tPvONPPPPLzMrOPPGPPPKPKin+HvPOmKHFNNPPLmZPPPPPPHPAlfHPLCGrrsohFPPPK+fPPLPLPNf/PPOGKCEAoNELiPPPOVvPPNPODnPPPKAEGJBAEEAjvPPPI/PPMFL+fPPPMCACDNHKpuHPPPPL1PPOFJx/PPPLIAECucnIYDPPPPOFfPLHLN/PPPMELMLLHJNClPPPPLH/POPCfvPPKLgCBKmZEjqPPPPPPC/PPHNv8AzzzxqDTyyhKiQvzzzzzyvzzjyN3zzziixS/TEJI9fzzTzzyzzzhQL7ygBwwRzz3tLzzzzxSBynbzzhzonzxiyxTzzwLzzzzDBgTyLTzzSzRf7yzgRTTzxzzzyQSjyzhzzzhTzC9jzwyjziQhzTjhSywzyGbzyjzzzR5/zyzyhTjzyyCDRzzFXzzhTzzxzxf1zrwzzyBTyyzzzUFzzyTzzzzzT8DFrHbzzzzzzzd3aKTzDzzzzzzxDxESQ/1j7H2bGyIjbzjzzzzzzzzzjw7i/wASMsN5jB/M4088888888888cwscmEtk6ZMu8oc88888888888888cs4ww80800c88888888//EADERAAICAAQEAwYGAwAAAAAAAAECAAMEESExEjBBUSBAYRMUMkJScRAiIzOBkVByof/aAAgBAgEBPwD/AA+R7TI9pkfKqjNsIuHPzHKCisDYmZVr9Intqh809vV3ntaDCtDdo2HHymNU69PIKpY5ARMOB8X9QulY1OXoI2J+lYbHbdjAjHYGCi0/LPdre0OHtHyw1uu4MDsvWLiD1EbgfaFSOalbOfSIqovYdTLMRnomg7zUmLV3OUzoT1hxX0qIcVaZ7zb3nvNkGIPUQPU+6iPQp1Q/xGVlOoygfvCOXVVxnXYRmRFzIyHQR7Gc6wCcQG0LE8hbGXrEuVtGEto+ZDmO0HKrrLtlCUrX0Gw7x3Z2zP4Z8yu4rvHqDjiTflVoETL+WMts429OnkKrCplyBhxj+eRh0zJc7CXvkvD1Op8lTZ0Mtr4W02PjVQiKOwzMZizEnyQORmllXipXisUS9sqyfqPKyMFZ6nKexPQgwgg5Hx0NkcpavC58OGHxt2ExJ1Vew5IijLSM46QP3EP5xl/U28SHJgZeNFPhoH6Z9WEvOdrclPiEJyVzB+Fcs+NvHZrV4aP21/2lnxt9+SuhEP8AwwqVgBO0RDmAJbWDX7Qd9fGNaT9vDh/2h/tLdLG+/KpV3PCFJEOEsGxBgwthOpAi1JUcwekfKvDEHdj4xpSft4cOf029CJiBla3JwmA9qONiMpdfXh80rGsOLtJnvLxr2J3j2M51PjbSrw4U6svcTEjVW7jk4XEPS41PCdxMSwa1iOUgzYCXnIKPDW3C6mXJnWcumvKz5VC5nOWtm58VThq1J+xlicDkeSyzmldfjocK+R2MvTiXPqvkqU6mWvxNkNhyKbONfUf9Evq4TxD4T5CtOI+kts4RwDfryUYowYQMtieh3HaWVlD6dD+GXMrqLbx7AgyXfl12MjZiDgsTuOo7S2kpqNRAZwBtoQRyFRm2EWpV1Yx7+if3MuYjtW2amJatnoe0fDg/Doe0IdDkcxBb0YQJU+xynurHZhDh7R0nu9vaDD2QYY9TPZ1JuY16j4RnGZ3OsCgbwnnJiCBk2onEjjQg+hjUKdjlGosHrM7F7wX2j5p7zb3nt7T1nFa3UwU2GClFH5jGsUaKIST5FL7F9RBiFO6kfaC2s/NM6e6zOkfTOOgdocTWNhHxDnaEk7n/AAv/xAAvEQACAQIEBQEIAgMAAAAAAAABAgADERIhMDEgQEFRYXEEECIjMjNSgVCRE2Jy/9oACAEDAQE/AP4e4lxyxYDcw1D0Ext1aD9mWP4wA/jAf9Z8Mt2MseQLADOGqTtkO8FychfzBTPUwIo6e68xTEJiB6+4MZlrO4WMSW7ntEpHduK0KwpMBGxgdhuIGB1aj4RYbwXZrDM9TEQKNMqDGTtFqEGzadRwgnxMbDc7xECCw1mQGBimR2gN9Am0d8RxfoCUkwr55BluIhwnCdtCs2yDrKS4nv0GQ5J1lN7ix3HGWLFm7mwiLhUDkjD8Lg8VZrUzKa3qKPxHKVBKZuvDXzKDzPZxfG3c6W+kwuJTNmI4ax+b6LPZxakNIaa5OOGsfmP6Sl9tfTVOUvnxn6x68Nf7j/8AMo/aX00jMUxQmDM8Z+sevDXHzR5E9mPyhokwC8tLS0A493Xh9pH0N2M9nNsa+dEwaTGwMp5sTw1VxIRKbYXQ98jylQykLLxVEszL+xKT40B5NrswHHXS4uNxKTYW8NyTtKa2FzudComEkdDKNQn4W3HIM1oq4zfpouoYWMsQ3kbGI4YedZntApf003QMIQQexlOpiyOR07iM8FMnNtVkDDOFCu/9xahG+YisDt7suC8LzETtAjHc2iqBtyDU+qyxG4tBUb1gqrLqZYd5h8zAJhUQS0vyRpgz/G3e8wn8ZbwZ/cFuxn6mf8N//8QAQxAAAQMCAwQFCQYEBQUBAAAAAQIDBAARBRIhEzFBURAgIjAyBhQjM0JSYXGBFUBikaGxQ3LR4SRTY5LBFjREUII1/9oACAEBAAE/Avudr0zhOIPbo6h/N2f3pnyakH1ryE/LWkeTcNPjdcV+lIwXDE/+Pf5k0mBCTujNf7RQZZTubQPpQAG4UQDRZaO9tP5UqBCVvitf7RS8Ew1f8C3yJpzybhnwOOJ/WnfJmQPVvoV89P609hOIM3zMKI5p1ogg2I/9LGwOe/Y5Mg5rpnyciIttVqcP5Cmo0ZgWaaSn5Dv3o0d8WdaSr5ipHk5FX6lamz+YqRgk9ncjaDmjWiLaH7+htbiglCSongKieTriu1JXkHujfUWBFiD0TevvcfusqBDk+tZBPvcameTr7d1R1bRPu+1S0LQbLSUnkdPvkHAH38q3js0cvaqNEjxUZWmwPjxPdXFZhWdPOsyedXHdyoUaUmzzYPx4ip+APM9qPdxPL2hRFtD94hwZEtdm06cVcBUDCY8MX8bnvH/jrk0X0DjS5zY40rFGx7VKxX50cRXyrz5/lXnsjlQmP8qE13lQnnlSZwpMtJ40HQaCh3E7CIswE2yOe+P+amQJENdnU6cFcD92wzBVyLOPXS3w5mm222kBCEhKRuHWW+hPGnsRQnjTuJLV4RV5bvOkYe8rxGkYWON6ThrY9mhBQOAoREV5smvNk0YqKMJPIUqCmjCPA1snkUHnE76RJFJcB67jLTqMjiApPI1ieBuRvSMXW3y4p+5gX0FYXgmTK9JGvBHL59Zx9CONScUG4a0XZL50pnDVK8ZpnD0J9mkx0CggDh3eUUWgaVG5VkWikPHjSV36+KYHtMz0bxcUc/lRFtD9wAJIAGtYThAj2ee9bwHu/wB+qtxKBrUrEwnQUVyJKtN1R8M97WmoaEUEgdS4oupHGlSm+dGa1zr7Qa519otc6GItcxSZzXMUJLZ40Fp59QpFKaFZCmkroG/WxfBkyMzzHreI97+9EEEgjXvgL6CsHwkRgH3h6U7h7v8AfqyJSWwdakTnHVWRUbD1rN10zEQgbqtbpKhS5CE0uWeFbSQrdXm8ldfZzh3mvsz8VfZSfer7IT71HCPx0vCXuCq8ymt7q28xreDTeKqHiprEm1caQ+hXHptSkVqKB62L4R5wnbMj0o3j3v70RbQ97gWF5P8AEvJ7X8Mcvj1CbVMnpQKu9KXUTDgnX9aQ2lO7pKrUt7lR2i6ES+80mO2OFBI5dyptB3pp3Do6/ZtT2DuDVtVZpcc6g1GxTcFU1JQsb+m1WoHrY5hWe8llOvtjn8e8wPDPOXNu56tB0/EeopQA1qdPy6CmWXZK8yqjQ0tpGlW6VLqylUlkVYd+tlCh2hUnCG1at6GiJURWu6o2J30VTbqVjQ9NuvjeGebL2zQ9Gs7uR7qBDXMkJaG72jyFNNIZaQ2gdlIsOkmwrEJ+XQVHjrkLzKqNGS2Bp03o3NBHcBaVbjfqbVClWCh3DjSFiyhepmEkdpr8qZlvMKsu9RpaXQNe5dbQ62pCxdKhqKnw1w5Cmju9k8x3AF9BWEQfNIouO2vVf9Ok1PmhCaYYXJczK3VGjhtI06oHUccQ2nMo2FIkNLF0q0pUhoe1XnN/AgmpRkrYVplrD2pCXSPDcVs3/wDMoB1W52nEuJbUS7UZmSmSDlPP6UiUg9k9k9zLgNvp3a0pD8Jz4VDnJcG/ucWgCZH09YjVP9O4wCBtnvOFeFs6fFX9upMlJbSdaQFynvhUWMltI07qdeSgoRuTqTUSM40jMoZgeApHm1rgC9M+chblwMvs0t7aPZFCyU7+VPFtYBQrtDdam3FyEW8POmWPNswvdO+kHzleb+GN3xp7sPMqHHSnW2lDUUG329W1ZhyNCc2kekGQ/GmZTT/hO7rvMIdTZQqTGdiOXTuqFOCxY0DfuMfg7B8PIT2HN/8AN1kIK1pQN6jYfWoUVMWM2yOA1+J6X3ciakvKkO5RuvUCIEJHcyJLTAGc2pLvnXgNkfvT+REdYTbw0H222UXPAUthtztblVNlSGlBvN9aw99JaVn57+dRkxW1OFJGpqU8mMvap1vvFJmmWsNeEcadWmGBp2OVSHFKaulB506JLzJyKAuKjmyAlXiA1qWnzobNA/8AqoDaoy1KXx07h5pDiSkipMdyI9dPhqDMDiQO4lxkSo7jSuI0+BpxCm1qQoWKTY9Xyeh53lSFDRvRP83STpWJyvZHGsNi37RpIAFu5xNaX3Bl9mmitvcqvOrpyrF/jQ80LV9N1BT27wt8DUmIypq/Eca9AwwbAWApDTOyClJHOpjO1TnaT2U1DivpWHcugoSGXDlULH40qxQR8KhrRsgjN4dKczPq9Hw3mmcgTlGlNC65CDuvSVKjryq9Wdx7h9hLqClVOIchv/CockOoHceUcTK6iSncvRXz6gF9BWHxvNYbLXEDtfPpmPBCDTaVSJFzUZrIgdzPklI2afr0uZraVGdU0Uk04tuSyUpXa9SHWGW9nvVamZEV1OUo15U20SobU6eyKlaMkc9KW62y2nMq2lBlCm+0L1iIXGbGRZso2rXnWHuhUdNKjbSTtAsi2lZXUySAvenjV5Bk7NxI2ZTW2MTsuHseyaZkNvJzIPXmxUvtnnUV5cd7Iqmlhab9efEEqK41x9n59TA422ntng32/wAulRsL1iUjMrJWGRbAE9y85s0E0pRUok1ardMJaQ5lXuNS05H1iouYyG8u+9Ss2yyo8fCnG1kMoWu5J/anIjLibKF6D6W02VvFOsLlp7fZTwpWGKQU5l6XtTjLLTYIVltTa3mUi6cw5ipU5AdZKeB7VGWh1sbMEqqTGdkt5iu1uFYYxs2b38XcYtD/AIqR86w2VfsnuMbj7Ceu25faHT5OR8kVb3+Yr9B0zHciKaBkSbmmEZEDucRc0COoR0+hlbLNv4mjBZbGZvRQ3Gm5CUpUXdFV9oR1PoPAUuRfRvtE15t/EXqumZSnk6NmnkOqaVRjCQyLqNIcShshXs1LjOqWp4J0VWHo2CS2sdvfSC75w4i3o7VE9WRyUe4cQFJKTTqVRJXwqM6HGx1/KJjPES7bVCv0PQASQBUZkMR2mh7KQOnFH+HOsKY0vz7qYrNIV1TRUEjWsNW2oLBtWyTt85e7NtE1OXtJGUHQU9ByNZgrdvrDJKEJWFmvOmLeOmHWsm8VMmJaZ7OpNNTH29ytOVIG1CZKvyqQtKo90nlTyEqHIjcajub0q8f71G0U8PxHucWjbRrON4rCpHsHryWkvx3Wj7SSKOlYSztsQYTwBzH6a9LysqDUlRdk5ahN5W+5NPetX8+qaWnMKgNo2wSaWpDUlLex7JHiqcxd3MyL87Up2SpGQ3tUGKGmrr3mpSkJaVkRmNMpbLSStFtKltIfGRlOo40mI+peTLSF7JkMqFjuFOxkNxtKktPZU5XPa1p1oKSFbincajTx5yQoeLTuVpzJIqxjTLcL0yvMgHr4szssQfHNWYf/AFrXky1eQ+57qLfn0znMrdQxtJBVTacqQO5NPaOr+fXS6WjnHCvthp3slOX40Fxw0Sy4L2/OmnHPN8z2VN6cxMhOROtuNeey/wDMozJRFi4bVGxVbQspNxUeWHncyD7O6kKEl1wLTbLuFT3XWvQ5tN9Rn5MlrLp8VU2zdF3FE1FgNlwvcM2g7rGGdUuCsNdzNDr+UrVpDLvvIt+VeTbdobi/ec/bpxVyyVVhTXH493iLVlBznV+tnCwrpU44uwKiaSzzpuA+rc3SsNkD2KcjFO8Wq62lgg2NRJzbicyh6UfrS4IfGZzxGoezZSpriDSnZALwKOyrw00jI2lPId1iDW0jrrC3LLKev5SN3htr91z96wRGTDWPjc/r04ou6gKwxFkJ+Xd4ksZUoq3UV0ZQN1Hf0NI3czTLDEVraOkXr7Rj21uBzp3aIcC0PnKvd8KaWJOdp5FnE1LjFpZSfpTLhYfQrkaUt9bzeXRBG+siWnkK97Q0525DaeCde7WLpIpv0U0j40g3SOtjSM2GyPhY/rUBOWFFH+kn9uhfhNTjeQBUJNm+6feDSLmlrK1FR7hwdtXzob6w1oLev7tPNuOvFSh2U7r7qQ+8tzIhKXEcdKlwVpTdjdxRQ/8A0Ec9n2qmbN+OpaNchp4doVCdeVFYNr2NTJDgYOZm3I1hT63Fu5tfj3mIJyTL1HN2x1p6c0KSP9JX7U12WWx+EdD3gNO9qb9ajD0Y7lagkXNSHi6v4cOoT1XfWGk+IVhH8SpylOPNxgbA6q+VQn0F1bSEWQnd8aUbJJpKH1rccV6PNvJ5UwAIMhVrJO6nvZqIhwwEKQq2VV6SDJ7Sh2OApphtq+RNu8xcWdQagKuyOs8MzLg5oNDQdEjwGk6zvrTPgHc4kpQQBw7p71hrjUB8NPA8FVNRlWmQNezY0U7FEZ4bgO19aO2Q8TtVbJXhIpMRp5fbkFf4axF1KGgymndV0xKyNttnwA60hSVJBTu73GR6s1hh9EOsRcEUDcA9EnwU1/3v1prwDuVtpWLKFSoKEoK01buHvWHobXwqJPsnZu6ikqjrbyggprzBAJyvlKeVF6LESQ3qqn3yolROpocTWIR0oaYdSNFb6wV4lpTZPhPe4z6tNYT6vrHQUyczLZ5oHRJ9XTf/AHv1prwJ7rEFENaceorqu+M9IcKaS/8AG1KkH3jRe5UBmUL8TU1pDK8ifdqcR9mMg8d1YJ6175DvcZ9WmsJ9X1njZpw/hNQVZ4UY/wCkn9uiR6s1umn+amPVjunAkpN6XlznLu6VdRxzKPj0gVastZelay6rtnfpU2UHtmhPhbrCGChjOreo97jR0bHxrCx6IdaerLClH/SV+1YKvNhkf4XH69D3gVUjsy/rUQ3b7uXCygrR0q6XH+Cem1Xq9Xq9X6cNhtPrute72aAA73GDdxAqAmzQ+XWxteTDX/jYfrXk05eG4j3XP36FbjWIDK8DUBV2+uVJG8ily46N7qaaxKI6vIlwX6JHql/LovRPOlPJG6luKO80zHeeNkINOxH2T20fXoPVAKtwvTOHy3P4dvnQwR871ik4K+g5kvWNMB5KbOEH49XMKv18RVml2qMmzY63lIvLEbR7y/2ryaetIea95F/y6cWb4/GsLcugdXEMYlR31NhIpeMTVe3akjEpO7OQaTg0yxK+yKZSoSEBG/NTQORN+VOozNqHwp4PtGxaVWd87mlflQhznP4Z+tNYI8rxrsKawiKjeM3zpKEIFki1LQlYsoXrEYfm7lx4DR6cqlEJSLmouDKPaeP0pmKwyLIQO4NTZ0pUlztka7qS/ijevpKGNTkb7fWkeUbntNUxjrTikpyG56VGwJpPpZpP4qQLJHW8pXQX2G/dRf8AOsJe2OIRzzVlP/1p04m3dCqwtyyrUOo5FYcVmWgE1i2GNrjXaRYprAHncim1J7I3GsaxG/oGj86wTDsvp3Brw6bA1lSOHWmRw+wpH5UoEEg8KvTDDkhzIgVEgtR06Dtc+7xvD8p84bH81YLPS4Ng9v4VNdw9hSQ6ga0nC8OkI2iUb6j4PHju7QdM53Zx1msLbzOFXXxV7bT31cAco+lDSorwfjtOj2kg9EpGZumDspVvjTKsyB1TWJS2oTJbbtnVWFQVSns6/AKCQBYdD2IxmXg0pWtAgi47jFmNlJuNyqbbU4sITvNQ4iIzQSN/E94tAWkpO41iENyDJzJ8N7pNMpfxGWMx+dNNpbQlCdw6mMveFusLaytA9aQ9sY7rp9lN6JJJJ6PJx/PEW1fVCv0PQsXSRU9vZvZqgPZ0jqruEG2+1bKTOnKSodq+vwqLHRHaShI3dF6xbCVrWX2vqKw3FnIytk94f2pt1DiQpBuOvjTGePn9ysFi6bc8d3ckgDWsQxzIVNsb/epjGpja/SHMKjSESGkuI49E2IiSyWzTan8OmfI/nTLm0bQu1rjpWrKkmlqMmZ9aYRlbHW8o38kVDPFxX6DpwSRsJ6LnRfYPTijGZBNYY/Y5aBuOqiO0lxTgT2lb+iXKRGZK1fShi0kSS7m+lQZ7MtPZOvEViuEJeBca0X+9YVMdiyg2o9km1uu42FtqSeNMtJabSgbgO4ccQ2gqUbAViGLOyVbNrwfvWGYNezr4+SaxuIx5ttAACndXk4tWZxHDpk4ey+824oapoC3TisjZs5RvNYUwSrOevjcjbT3Bwb7A+nUgShLitu8fa+fRIRmQaXePJqI7nQOs6sIQpR4VKkvT5Fh9BTGCsJjZFjtHjT7L+Gyeyr5V/wBQ/wCHtk7dYbHXLmZzuBuaWoIQVchTPlCgrs4iwpibGfT2HB3br7LQutYFOY9GCwlPaqXHTLjlF99Yfg7UY5l9pVTJzMVF1HXgKlS5M5e42HAVAxFyET2N++o2NRXrAnKfjSVJIuD1FKAF6kuGXKsN1RGQ02OtPkeaxHXeIHZ+dE31PU8nJmR1cZW5eqfn04pG4gVhki3ZPCgbjqkAjWmMNjMPKdSnU9GNK2k8j6Uz5PsKQhRUd1R4zUdGVtNqUkKSQd1S8BYc1bOU06hyM+W0r1HKo+My4/ZX2vnWH4u3LOTLZVOOobTmWoAU04hzVKgei4raIHtCvOo+bLtU3pxYbQpR3CpWPPLulpNqRFxCYRfMfiai4AhJCnV3+FJASABT2cMrKPFbSnVuuv8AplG99fhUCJGZZTs7G431Jw2I9e6BfnX/AE6NqDtexTTSWkBKdw6mKy8qdmk61hcT21UOt5QzM7yY6To3qr+bqtrU2tK0mxSbioklEqO26niNfgeiQ3nRTqTHfuKhvhaB1zup1Cl4pYj+JSBZI6Zj4YjrWeArDGVSZ4VwBuafw2K/42xULDWYi1qTxrygP+Dt+KvJu+yeP4qxd19uNdm971bFnPfpMDE1cFfnTODTg6hfI0pIWgpPGmcKhtKzbO5pyTGYT2lgVJ8oE6hlP1rB5k16V6S5TboxnDM4L7Y1HirBsRLa9g4dDu60ySlhonjTCFyn8yqZbCE2602UmLGcePAafE0tZWtSzvUbn69bAJ2wfLK1dhzd/N04jFzpJFQ5BZXkNNOBab9dyGyt5Dtu0nqeUMnRLA+ZrAIxbYLh9vp8pF6MprAE2hA86NuNKkxk71pFHEYQ/jJpWNQAbZzSVBSQRWNyH2GE7LidajRZM5w2N/eJqLgUZuxX2jSnI0ZOpSkUy828gLQbirU3hUZEgvW16rrqW0FRqS85MfsN19KgxQ0gdfH5+2e83T4Wzr8Vf27jCZ4mR9fWI0V/XoWnMLViEUoVmFYfM4GkkEdydATUlSpuIG3FVqYbDbSEch0+UK7ygnkmsMRlhtfKsQv5m9b3aiR3pbhQlWvxpPk697TgpPk6L6u00jIhKeQqfHEiM438NKiSnoD50/mFP49JcuEDLSI06Wdyjc7zWFQ3IjRStV+stYQkk1OmLkryI3Vh0HIMx6+LzfNIpsfSL0R/Wib6nuIExcOQl0bvaHMU26h1tLiDdKhp0PshxNSGVx3bioEwKTV+5EKOHtqGwFdTGTnnrt8qijLHaH4RUsXjOj8JrBDaf1ZOFxpJupOvOmMHhtexf50EpSNBbrOOJbTcmps1cleRG6oGH27SqAt1nXUMtLcWeykXNT5i5khTp3eyOQ7rBMT83XsXT6JZ/I9MuKl1J0pSXIrtQ5iVpHUvV+4dwuIt3aFHavehoKcRmbUOYqJgwjv7Xad5IlNMJuo0/KeluWG6oOHhHaVQFuvjeJecL2DXq0HX8R7zAsVz2jPK19g8/h0y4iXUmiHYrlQ5yVigb9BFaigv7oSBUvFEN3SjU0G5Exy5qJAQ0Bp3GOYps/8ADMq7Xtnl8O9BtqKwbF/OAGXj6Ubj739+mVES6k6U407GXcVCxC+hpCwoadKkVnUmkug/cCoDeakYmy1xuaemyZJsndUXC1KOZymmENjQdF+gdTGMW83BZZPpTvPu/wB6Jvqe+BIIIOtYRjIkWZfNneB97pkRUuipEFbSroqLiCkGy6akJWOkoBpTJ4VncRSZQ40l1B41fuSoU5LYb3rp/GEjwClyZcg6XqPhbi9V0xCaa4VboKq1NAdTFsXEe7LJu7xPu/3okkkk6/cAbaisLxzaZGZPi4L5/PpW2le+peGg6isz8U/CouJJOlNvJV0lINLjA0qMsbqvIRzrz15O8UMR5pr7TRyr7UZr7VZo4u1ypWMck0vFJB3Ci5Nd503hz6/FTWEtjxU3Gab3J6SsCs16CerimN5MzMY68V8vlRN9T9zwzG1xvRvXW3z4pptxp1AW2sKHMdBp6IhwbqkYatGqKbkvsGyv1qPiSTvNJfQauOnKDwpTDZ4UYTR4UcObNfZaK+ym6+y2qGGsDhSYbKfZoNoHDpuKU8BReJ3UlKjSU26jrrbSCtxQSkcaxPGlyLts3S3x5n7tDnyIa7tK04p4GoOLxZdhfI57h/46SkHfTsFtzhT2GEeCrymOdN4ooeIU1iSFe1SZKDQcTzq/XuK2iaU+kcaMscK2ri6Swo76Q0BVupPxaPDFvG57o/5qZPkTF3dVpwTwH3gG2oqDj7zPZkXdTz9oVFmRZSbtOA8xxHTalx0Kp7C21cKcwtQ8JrYzG91CXKR4qTia/doYp8DQxRHxr7TR8a+0kfGvtEfGjPVyrzp1W6rSF86RFWd9IipFBAHVkSo8ZGZ1wD9zU7Hn3syGRs0c/a++IWtBuhRSeY0qH5RPt2TITtE+97VRsQhyvVPAn3ePUtRaTyoxmzSoLR4UcMa92vsxvlX2Yivs1FCA3yoRGxwoMJFZBVurKnRYo9K5r7vGpflE6rSMjIPeO+luLcUVLUVE8T9/BtqKjY5PZ3ubQfj1qP5RxV+uQps/mKYkx3x6J1Kvke/elR2Bd11Kfmaf8o4iL7JCln8hUjG571xnyDkj/wBKCQbg0zi2IM+F9RHJWtNeU0gesYQr5af1pvykhnxtuJ/WkY3hq/49vmDSZ8JW6U1/uFB1k7nE/nVwaJA3mi8yne4gfWlT4Sd8lr/cKXjWGJ/8i/yBpzylhjwNuK/SnvKWQfVMoT89aexbEHt8hQ/l7P7Ve/3T/8QAKhABAAIBAgUEAgMBAQEAAAAAAQARITFBECBRYXEwgZGhscFA0eHw8VD/2gAIAQEAAT8h/hiVArHsR1wRoq9q/wBTWB7UJspd1C0NcjK8YSC0B4gFIJNTfkwtG+0/MusV1NHR7LgQFfE2V6Edj9RUgTUcf/EBWiBU33K+tYW96E6yf3Hy7+vSR+R+ZfPRDO/cr1HxrESCI0j/AD9LvQWw88I356Ex0Nyy/f8Ai2LRapj5k84QwP0xeW7Kvv8AlgrRDrbz1T9TuzP5D6Nyjed3iJ3pZ6Wjq40+JJbtr/8AJrESCI0j/I0dzmkerhz+ptziavC2wp/UIDoKJ0m7ST/w8F3U7xTf2Tb836J39CiNtnfs3mpKaP8AN/GH6Nv+8QxZ0HLc1ONvzCJ7z/nqf+ixW5NscKgbHxK524rY+IvMuggYGgv2jGERrjgwjzM07Yslhra6WX9fw0QCq0BLdpr5cuCMBtbdpXr12lEp7TZx5mxTQh6VEenNvhdktYgIHdL5jR6WduKJBEaR/gOgU0BlVh5b9ry18UyZb0JTrfhLacn1CDB4mKCuRLfhQWogtsQ2TtYmSYEw/QS+K4rabKLvB5gIKJ25OgA0jhE9ZEAqtAS8n7V5WPnmNrqfmG7PEJlPEBoOJt5ukdpi3Bm8uESdc3749XOiuC3Ls+J+xIkAZsqaXF8EPBLZfzE/16wiQRGkfVUme1dnJEWxGD47xp819EqkZ6oDQ4lwIPi4yuXX8HoJXPRMeDLfU7RnJ7TB1TrOiZggl8EMsc4+lpj+n1MA49K0f0cliUMqZ2JYxrrNKHaADgtSjSX4PXMC0PXqwssIVYD+EOnwMs3AqMDzd9k/54fStNNX38qCD9jiSLpKC+diZwIvzN1nTi0ihvsCuZQLWX1dOnIZSunoVWwozbDk36cahynfqEllrq+19BEAqtAQMGI/V7OKAjwHwTJBtN3FcVlLBORVTN5U69Ut7LXTMuf18xGKZ6yxDk53mO2LzLUqgFQ82F1XWNbeiy/QTaNqTJB/aBxgbOJyu6ms9f8AURGnnuxx+SOk6L1v9CaQOhxZXKoErb7BxtLV8qzSLEu7rFYa+qGCst7mAr15NB2nea0I5O0Xqn3esqE1X/Mwva3n/b26xTYG27xLhv3HO3O3Mns9YYXMAX6B0t8T/fMXuL5lU7zt6urxB28zWvoRuTz5h6CxnaRNq6u8W+FLEfz6UHD1hIeDpoh4M3ukGh58sGODEd4yiz5HSOo1IB2miyoM2YXljIlsdTXYTTQ1zbzBEs572Qkz6ywx4OfQqL3nwMt/KHc5fzaQv6OIiWLls/hHYWX8Q0NvQUC2d1zMFBiF8dkgCdiFY9518S8c5ctYmqIB1Zr5D7RsZty7+J4tx1gKkOnUQY9TAlG+r0lwYnue0RBsam8ERo18S5Fp4OzBEs5w41Iv7sdyZOz6AkfwfR+OREAqtAS0AzadeXifXtmbCLz4g4ma9G4OXVyQRV9RgEGfiWDdccxAnp6pZhDQXFge8pawBfWVYLZWCGlzpBORD5mg91mYKBwOs60j5XMk2qOsbKlf+EzInObVjoyxlZgznV9LFrodIiNPGzB1n4cRZbRqjrrKMa5YegC+xGSysQx6eNMh0ezFWvXFwgbGX7h8IrABYFYbJfWKn6B1nsAd5Tnc28zEwqsmgVdyXZLidqj7eho7dYHJRYZmtlW+h3NFa3TDB5zp6M97X743sZwfHxBC/MrBi7ggrU9HG3u8m7wFETUiVxQP8oK39Bc69b/ULtakHzBAdL2IUz15HYjBuCj7S7KKLPJL6918kRqqUzM2jH1CoZL5XK9wau7HXRr0CwsSeRr9owjtzkPub7fAkLVoPM+dDMmvBZql1VMBnVDT0fGccpplwjFy1zOgjVaSiu4Bg5oiCymcRsYQBxWv5mcTCiRom418YvpqUQJf5S93qOhLq9Wz+xPfl8+jhGdTZpiXzGJ9Y1hgUjqMN4viSsfaAB1qAXo6GK07uUWQKmEFsSJXUuydOnxQkNXaVqHK9okHToEB69QzLA19EzxHeJjRu2b3lbvhM+WOtqA36S4lK4P1aLdz0TX0SLG59WeDudNrlAMmkff/AJxBPCx+4XPE3o6GFM84mVudQpubq9AmqkFQivnrepcrIvwkuXQOwSzF0SvfsaxQJ3LDEqDFNfMw67wd66Rp4IZMoN7TYYb6VV75M86c79ave/8AY7Xa9nGoe0sqmv4Q9KvNNUEQb4uk7ylHThbjLiU3hoMurU9IaYDvCtDGqdwWYHDNNDqjrlv06Wx0lkYX5TrM7SBwz9o9KhbhiX06PPhLQPhBw8l/dcHRjdwWf85r6bga3bDrhxWOGVTWCkd+DrQvQmmEbwyLXoxAgzZai6MKG1H9k0i3KnnD+I/PD+WsatsyHrtB0xv+PTHrRH7Xlw7c2DbPiEE00+dy4Ol7T2O/MoPHpJGzsRucvItRbeNEhskcowIN/wD95Ae5goTLaydLXaIBNE29G4hCdZrE+LuAmTRl/rNP9PUojujL9zC+1cR7Ef1wVeOaSaPRFaUEvWzRyURV5DL70RZ3ojMg39kM8Wv3Ski6NCBfR9dXaBKxx8YmuL2j3RFCnvd+8LoW19XP2Ccxp7H5IAA0DgqkLPOCvRxXqcy5ZxcvMroMcztMY+i1fRnR/wDx3TPBnyq8wNRa5YmLSzJ2ioOkUvra7zN8jHq4u5LfBzExuVCI3L4aseXlPo+jkoI2lVtDPi801JQ2g1ndlyUKqN25reyUA9eWWpbmYkQA71LGDYeH1Tl7xY+/MhF0CGHufk4akdLzn1vSp4ws8mrlV+eEq5itSEaKFGWjOiPYaGYuTQ3B6hSC2berP55p+/N2Of6lJ4HghfBh36WKGyppur446OQ6jVGXEYiAiIARYHclE9psSinq1G4ao8esRXzQuunzuE8UfEuAvxTUdkpfSSypRDycViuFgZgH5IqtrAWAI8sLjKmd/fAACg9YP2u5h6sH7idSrPYcDZduC9R4OcWxe80ae8tKcNDzIsSQdVOuGK7HSBFu+xKiwdGk2jgbzHSJXBamXaaCj1gjAh+jbkGPTZvyoaoQLvz0w2QlW5lO7/snSove/wDeDMh0RUe1cpB1aL0n6+hOe+bRDYBlWJWoNJ5nU+lxDt6Rj54LOD50Sp8I0JdIlPnEVgjtFpQxKno9pqJVQ7QTFNiVNE6ZTClVz4DKGrVBOmXcZj0vCBMDKe6ViGnA+iE6uMpU+3MDd5e//I+y8QLZ2uWHQ3MjkLdSkiQmUUaxiyI6cXeSiZjS8XWAw0glcrSM18prtKviHVCnlPSBsm5yvSvcF2QzUjWy6D7dCBsIYSHcqaXtxLskReHMYzf4JiUJqMUz85ue3AExLB9RLFygRGHSNg2uVPVLV3YSCg4Vm39Q0liYfQJSw3C0tKIYH5D6g6iFMzBIAxd0t0CGxQ0cmiPmXgZq+YtLN7oyFq2vnheuxnv8PDEQT/1QsrU5WybGEWSPgpSWBnzwpdXFVtczycb1mCYp056MGVcrf+f6KpVBqwshOIHrrslR8MbOnDW9dHozTGaE6JmxTadr4ghsRt0x9iEXtzU46h+fjpsNTzp98agO5Nf6OIYPXlB0ajg+/h1Zfwi+NSy927QfgTSEGZbug2c2hEKZsPo9A0+qY5vNGNYU96gPpLN4vZ6eOXEfMoAacb9J9dECjmrFf9hxFGyHfUUOh14U6oLZpf0wMrbHNotC4fFpamxtHnoYR8q6kMyeNdod3HxXaXRtlmEmQT03Yk7wnULVxLYGxIg7Xe0Tjww7xPk0tqBwEWrDA7f2gEJHfkRpwQ7uKIZhsc1Lpi268ERKKravJYD8H1+uDpMDnGYmVn8IQJyqAWO0/TSptKVdAnKKhSDCD8wUrWElt+NxTS9XCWgNtUzBMtJ3sGtQam9R4Jbx1ATGy+hc06y2KV3S95WQvbi4n0TRKCiMwsfJHdZVvFZNQ3sw7I0aygiy0qBNWhxZumaxNDX8Qc35tIX9HLT+VO5GL6T5DgL4zA+ldytHUxz63iJk5OvS5QehxSboeYjdTfCrvdTEylunsSs9QjulwKl3hWYMxLo4vSfmEUmFzDJwKYuAt1YyozaZj31xIN7tTR4Fh+sG8OMfivM+3RgjorLz/UBjm7Tt6uhNb0+RXzHS3xv98REePMurRf3DY52J0j/fII5liJ+Vjxxeo6qsHrNmDRXfhyf21BxRehNKJLI/qip9Jp7ksdZaNP4mP6lwF0YhKYP8zYbHKyNATaahj7nq1z+eBRshu5pPX/XAFUanvmMI+SGkfRfZCEttJ4gM2zj2X4B6ih7DaaLVeXCAQV1mXbwXNwjk7zuPpYYOeprL2a80JdRrYdOZY6CZj5/MARywK5hx4Uvz7IiUVW1fQtNdH18O3cI4PxM1NJZeISF8nSFgrgy+YcCbhyUrJxH/ABtjhVYPrZy45Hsi9/lSsGO3MsMBMo/3mKeYZA25qgi/Ylppo+v9IOnA/wDeHkAWY0/MNF/yCPBIIgH0O5bIAA2ndsPmEblFx6jkN9Jn/wBJDAcwBQY5zvGza9P9HqJpfr/bwZjKXva/mGRf8gCx4HGAuGH8MS1rhBcw6WW9lACXwDkQOWMez1SIREbEgdd628FcOmZtXrAqmekDK4IMfUgymbtBH1w7Al2HhTKsWxAED4XBi7g5AvX2rCJRVbV9Z0AGxMIkDrHw/wC+KTBcaE42gBveHskHhrEJmLs2Opo4gHf0QatQDFLsvlewPSLF2YYUblAxFrgnKA/xSSdAptXKr/ARCIjYkFYejb7O7idQlydPWFa3+EpU56M0d468TRsTXkYXUEph1XPJEes2D4Hh65udWL2pSuTDsEoIoTeIvRH1YFcl+00zESiq2r/DpunLX/cR2P3LOAHaMcI62eIMJYDCl6M32oMYeFR2SaqeNKV3Z3mE9sTQhNNMrglN7iNRnWCOQHo2qd3bf94/ja0pz/eQemm7+W/EmhcIcI/artFfR8kZBDuSqw95uMfoJR35rj1ohvNnTrDHCPqN3OzwpyPr4cfubTSlOP6z+QiERGxJXFsf7msuP66PmHih2l3iZU+GJ+/Ya0+zNDfJCa/aHvD/AMWHX+E7nwimhCNJdMhETzmqZmnkAOStZ2PwEFsjHVP1FVt/ljy3dV9TxhDA/TKgot2x8XkQ7ROom2TZMZsjJ5oDsw22bZm1QHaA5b2BsGX7S98QX46E1u9Jb/PRCIjYkozI6ZPnWVx1QTspfkfj12nycfBvK5tZmeJfUK+9Yqtv/wAQUgTRMQ0BHY/cBDzNk7XdcCFGL6GhYt9p+Jrl8GALESC2B5hl+cJCxNctlLupqKewmir3r/UexHTBClaq/wAT/8QAKhABAAICAAYCAgMAAwEBAAAAAQARITEQIEFRYXEwgZGhQLHRUMHw4fH/2gAIAQEAAT8Q/hlHjQFsDY+NZCuPbv7nJQ9qqfS90lgilbklcJQVqvRGgu7oARC8bEsldi9WZbyCrPoAQa6WoPuoi03i5y7BQ5q1VS0JqAofI/8ACAAVWgNrE4fs/Um56QQ7dDRZ1Aq+z5ww6qkgpsrYgvTtKdPNhZ92MJZIBSJsT+e8Uqfb6I+x9L9vKFQXFfk9/wAVxp1YqXefsf8AWjvbwE01r+WAAqtAbWIKo/8AlEmB9BVfm3vwo6sNwQPZnjTxILoy6qfispykhkKtqofiilkgFImxP5ANyQw/aw5lan57kxCXFllnZ+2PIWewiKTtrzpH8MR/9p1J/DDVXDtTLq8q6pEWCEYs/BWMLW73HRLXMuR9P8Z1U9p/xkT6A6AOVIKsAaF7EEQB7GWKqnmF1AB7FI0NTFQuJhf3NymofqDY+mOuD8RqtH4n/Z8DMSrpnpjeX7JlGjyh4Z9kUC/tDBEZpHm3zpPd3zphGZUb/wCy/hwskAtV0BDGxrfF35aTrH5CkJb7E1+LdaR1U9op084WwXN4WVIFc18VNkZuDGwwltoBFNHUlUGBCBhhzFTua794SyQCkTYn8AOyhlBQAbWDdYvd/tynA/UeU6Cbwiuhge2W7P4IDnFoQUGONk2xgGREcOvMvf7eGaHBA0n5oUA1BrQyib4UO5eAfcymD3IrtKQVEmBeOYCt1o/yhOyhlBSI6T5gskAtV0BA9gt9LyFAVi0BW1FBu1fVDTybl9BWhDgAOI+QEsMblkLGf4JKuse7HLjbujsRZrgsMLK1+2RV03Yw8qFgwDK/TAPArUC1CoZAHMe8GxwCQlkgFImxPlr5mO311yP1AJ3t4Dcd4GA9n1BC4TzxG2BKLBcpgo/RDn0yAmC7s0+gDpzrbJc/QoKqp1hHSGlHyqAUm438wNUWATcwnDFuI5Q8xV/c3wfIDYxN8P7nJKyAS2M7BmdJc93gl8EGooQUHANodiHrFTNG0JoD5qI3JppIGyJmhPtRN1MBAnxwSyhsjHMeO1S63xRetahdG4rkT/Bq3uvFcwEK4HP9nyxYQAYGjkjNEC9rB0OZ0AAysZpyptfI8YGw5+BWITNz3LzU0WrOyYMWNwR4LuKuVtoCLEYJJW8UNr4AWSAWq6Agca069140CujMtXOu8zP8Zvd7EeEAFHbjRLsA1yBC2lO95IPuGxmjadls/wC8v11ot+okR+OBrFdTUMRBU1FzA5ZNabkxAUezqAdc6CUxpQRcS3Y76CZYxh7kEEbHgkXKdnJ6/u9ZQAiNI7HnK16wmOKYRUKNylum3tBXrQ4jmUCuRwrQbZmIz3dypF1Q9pDFroJV+zDzJqVNMQiIfPQl+Kj1O+WviAB1M1epKNsye2cVo8PQP6TWg3iKYuDAvvIDd3j5+oyHyUVhFTb9o5xWAgZm7B16Yf00RdQoGx4VXNZErjrmt+4MpbINSixbx8jjt6iMQqqFPJ7zzkV3gUcaXlFDbQ6sQ2rC1FmxCB8SzTQA2qkOajoVLAnkt10lNdo1hMoKooKLG0+iRsub3SCakm1sLt5jipap6O8kW9QFur3hJ1ixaEzDv2DINII6TnGtQQ9mLF/TK49Pwwb5zGo4pdOT9Mc0p/RaeXN/d2eLmQoC2PUqk9R/0ueBdoHwMkoC1h8sMdjK6f2cS7e0OahDnAd7iw1iHQ+4l3GkMrZiVcWywpPthQKMpZAZK1XvFFqNjUoxPW8CMpRfQj/7qvJnMrF/bENhju7QobjO4mHGEDOXAAgiWPOf9GqBGR5ukNw6fAGQr8R39nICyQC1XQEqHn7viqorVoTZM/8AQTHUXwtcni6ErhcS+XNQWpMdtKe4BWlQ0x0CBRDQyq4MgPorzGaAJH1mjvdVcEGH3DtuAtWTcGrxL3u4KJtk0BGdrUtXBfkV0bFKjY5laoV8wC+8xYTSdudiGlZMnEq+GEtvGedPBf8A57iAERpHY8Wc96nfitZgS4i3cBlSkzQAfAlVCV5Y8xUzZEczBiLNHJN3Aa+quoSK9sfQ5iUCgXOrvHE1RjKFjDmxXdCFmMXU7aI2MLPdd2LNjB3al3AYahXGSZRULma9UlnF3qjWIW0BDT0QT8bLFkvajB250ubKIqpHPMUAQR52szWd8f18S1P37eLtEL6Ed3DdBpRBfho3B5EkRvgzVII+SCB269jGUcy09z4nSZX1HeFaKgOs5ZcCfsYtQjaH0BDPLawWql2sfBkyEH1ArvUBiMg7hqvcrYV2iag1BJehFft6uz4YSwQUDK4KOrypekoc5b0p1DgVKDA2qoJouZbbBl9vAgWMma/AgOdr8IAAfDb+jry1iaZdKiOUrAhutaWgnbKkKnuRPSRDplSbK2OcWiMqxSHmHy6UI+Mps8twBKqguGzfdl6gqp8YBejO0Rlspbo0Qp1j938JLdi/UEgucwFkMd2/kDBPpAnkgj61dUXiC57CZGAJiwHQD4VXqYneuWuZbZOzLyPEYSpBumd4yMAXuZg8wbRfuPad2ZBFY9BaqL0Q0KY5GEj+kobrJ0ExJs/fhA+qpo7RWUl+vxLkgfrvZ0SisnBw/DBjahjfsT+SEI27c9bgbQUUZH4+mP8Anw3CS9I+iOIsF9lgCGvhWS8Qd6Rwb5HTws+j2Q4X0PcFY8svaotL5lg6JeNKCbCNDfQEjB83SASvrhBeN6et6nSbndnZiJXgjIDiD0GrZMU5BdMS4j9Smx+FjmvEAVZeeZzCv/t0lstoPHDYojupuf8AxcGgr4q0Vh9ieogCzi6TFAVoLYg9woahYgHRFIHgNZYTRlNGIRJpi1sSPzyS/wDGKVK01gg1XVjEvaW8Mq1CtT2RoZo2/CfCynS2sN1kIc1di/rHgGA8gvDOk7EJTtkNdav9/GyNYyM5gAUcaK9WUaYBqlG54CRHAR4VAH3CBjDfT4JXFpmyNipv1E8DDrVVeo6kMV2d2S6IVN/PMMcd1LRFbIt89M0dsV6Vur8aEMIRNODjz+OYTDJvt0LoZFaQK4eHIf0v8wfrj4isYe5lsJ+QzbGuYkqULynk5lw86e2UtVReHdkwfUVuPZhdC3s0KwxgOV9YuN9Kke6SUgwaYQCDmaesbeXU2nTFh0J2aPjJZEEVOO+5kSDK9Jg2l5zvROHscK7tJ8TguDVj++auQE+YjbxJR7Yqif09YssIZEmcnWm4v0bpsU6EDMZdo3oY6+/XsiFge7A9vIWglEiYqe6fdAod3Tr8h9wYnNKsykbLKUgz0ADwcRXXzT6h8Nlhl4Cssuavi1HldJDwhuUkgHh9zulPdy3ToXUgt6iY0kFN+kKoKqel3IDZSp6GCRFz6ubXY9IMs0j8vrjn1ecylNOq3SVBKaMXukvg53JP9f8ADRr2mX0ZtgS18GClOX9IlewlEtF4YeE5Q5vdKuKjsp3SiDq9w1Nz9RKZCCyjWNtGS439Dw/LejTf7+Yo1IV8ErMoGmyheBvg0XbePxHWtF9jkFW78t/NFIqnVNzPPQxW3vDKUd2tg1fcwfrAK8svbDn3Uj5FRkfywYPvJr383Gt4zvTYIhsR5AcZH5SfXfiMDasY3aWKcTi9nkSNYUHaNW3fAUOiMKcyzLO2aomlOiJ9S0T4Xggihdppcr4s+U+7KfReYuhgXpQCXTqr9bhTpNfe35fjmSIsYOFtzeAU4FxQB1hSlumFyldrNKRe3LwGSHhCYMwvkB3oMsCgNHy+NOeflmvfMwttr9D8PPEP6T9MHz25/s0AVLf8QZ2/QcEk/wDsgWsI7sEoCHpFcqIW+lprUEw7oLcaBUUmIRa6JT2PZGdcCL5oCwe+mo3l+dM+oHaLzcpqvaMQwHmZu1z0FsIFfibLuK/+3ThzElBDfCedLkOo4vd59wG3Qz2us1HL/wCKGVVnr6jJtn7lRN8sPaRrWlpSRNX1Wzu+MmeqDhWwxv1kkQTQKgKCpEhpXW9/aG5OAe1SpR9obLgCtj/XskJ8rqB0DnSoLogIG7yVAi95Y1I+PO0QZDV5OCFY4M5wjC7Qf0DngP3f3b/ObHge5orgscg3+qK26YQD3OQeJKgHe6VSYU/nWdnhmfC3x377CCFN8Epy5mpL6g0wWm6/aqUFC5/XZxD4GzuLDlPKrtZZhZjfNI2v2xcBh5ykl3et04rF5vUJzwQABzEz7qlElT6Aj5IHxFOtM/IuFi9CfmXMoYc5ZCnkuBRYlME0qG8dUfyj7JACgNBwDHuvSD/nIaR+Ctr+XIhscJc4ZbbT5GrpB7MKmoDiGFV0pibCl4OLCrNOYSqlZzeLB92DBFKLI2qteBWG97fBggbUKerf3FLYG8ojEE92NAFbaiWTIO/AqqL7Rhl6AShqXaRy5hXOa8zQH2ij2+EQUFo0Eq2uKd95pl5Es9S7PA+ShZ6gH42jSneTUcWmAZZ1yv8AsQ2lKL5gxfx9PEIRfLvn+vgk2lEskyu9GEdwL5EsmnbWZeBY7BOrBl5HbMEIPmQ1ECnBFKbH9HABOvMeI5ZABoBeD4AXBaTKfpa5zTY1pOUVN+lAOCQFuVJCABQcGYbxoigbEVDANHMjnxj34oBERsTYytj8f88DzxCGBQ3IH2WD6PNZhfVRXmr5msX15PnaGwt1x5CdpysbTV9RRl0mtLb0umCJ8RtYVuD1zRitQk58izPSV3LuohdLgiUEI+BJY9EyZa0CBs5CXAWsbFS/WbZUUxHNUzV3UVLJELVdq8h1vf4joffARQx20YXqPGW/mESsSzlNYClQBfRHXrEqHuoKl3XPgMXaGVBhhsaSKIt9wNiIfbMw92PNzMKcaQay2e3Ko4bkEKsjus63GqdrFKbdXYhk70bqKTzapRg4CiQMqjB4IU9Gr1gdsbefOIvik7YgmsyYTfQyrivuqHFQ37zjogetdniBADRzZP6uzyuc0J/RbIISjRbRw/p4DtEDLcBseupC20B5ySvul9C5IBN0IHriLws91qB7crFKHrMl/uDaQxahkBRdUFt1GaEH6lIV3gUe3KlrxPpSpaEBirFOqXBD7UjhZ7KQSDKEbIxfR03fNCnsiTMkt/1gTOhfNRYta+BN9bZstoW+awLDPXCoTIC2u0WF6PiEELrPPTvuQwt8jP1gpQIu+J4ixQ5NGlTK0ijK6Q5w3kJt39BjiOC4uBYvQzBNA7EudXSqcD/O56mCiBztwZAIlIyyXfe+HIN9ZggFxHjvEfaBzFa94HHOgCIjYmxjmcjr+z14R+sSKVstX+5hG1J3IKZE4MGnmNDSP4g9qjvl4AtH2Qcaf0mAWl3jdwVp6lKcNqRwV5jWIA5grttRWFKeoCIbp3RUR99ZpoMbEIIb6jmuaWMdqzskQE469bBABRzLg9Uo6TpZIhartX4EtK1GrNwMGD1iPAhLZ9zLPfdvEr/fsQGLDwPaFWuVBESxlkMsQ3xY+OAEwhSWwdbj/qnqrkki8e5hYIpY7kQJOgrmP+1qs68esbkDdyFQAwRhfJfIn+DdHdY3rW43Rr4mPyy/GmZCpkgm1vh6Cf6AVBBHjq/DFOSiru5pWAEsdp9bFhyXyaVgYivZbhl1yTggEWpdw5KTR52P7HyQ18Vb4OIaCawvpdhLB51HcH7gnBBLtkJEpiE3/DfHBL6khiPc6HqP10ggFBEEu3lKKLh+X6flCyRCkTSMH+BWkPA2JUJVNRelf/4MOrOpw8qPAyqgljQlSYnB8zQJ8yxiAOqwI/swtBzg2gBSG+BEEp1XkPuCh0pCWSIWq7V+YOyllBYiaSFZBWr/AC4Umy6fTC4RXTZ6jPisSs1LpHDAdMq4G0JfrN4KeZrIpS3vEyYObMuXA7MRwlgiz7sfMelKo0izgIAAAgiEYNwpADkO6hW//aE7KWUFqrtf4AWSIUiaRi+mLX7PZ4kYWIdqRK75NOVFafqmOUj2YJwBo2FqbRu5rYaEGUHsMTbgerK9k9Ckl3Z01luL6Mbwv0Q88GWjkILneBKAIJlgDcY+GMDHIA0N74u0pZIhartX+GVm8HcPppWf1Y0nACmxD3Z0SUXuzgY4dbfTAuQzyymWInzCMbyAEnSR6JaUs/3uHU/PDbWbpvqUEQwH+oEwBwNyzFJJXDHeJ5Q8zTrYHjisgitAEF6P6f8AH+NHtCuTA632b72ejhuVQiXQ3hj5natStrX9k77SgHk+FTDh/RuE3Y8w0gwTkuI7wWzNxIzYfc1QsRpQegghKgZ1d2BocjzK3fKvatcH+QAWSIUiaRlT9osPzRpyVk4hE0hIHYkbQj3kpaFaDH7SGh0i1LROmPxQLVjtsUzr6j3UmwvtiaGei4xaE/Etgn7Y0JfaHAJ6nRORRSyu34t7Fr3+r/SlAiq2rtf5etvATTe47T9j/rRtO/TrjUM2wYXFuZsL/DE7j0cg9OGLby109GfoJr5BoOV4/l/j0wl5iq/p5QeKVvt9v88LJEKRNIxcwyt30YyL17StgqsIK77Hzhzg0BV02KCGexyQOfr9pdygRVbV2v8AwjQmtCh8JCnmBVUT5ucuwr7KBNRHWJO3kF0/YJhzh92YReNI2QoLurQErhKW9V7YCKVGSbXsku5PPiddO/f1OUV/EvIWjxtW3+J//9k=',       // embedded copy, used when src can't be read (e.g. file://)
      fallbackText: 'ARTIFERA', fallbackLine1: 'ARTI', fallbackLine2: 'FERA',   // only used if no image loads
      fallbackFont: '800 {s}px Helvetica, Arial, sans-serif', tracking: 0.06,
      diskRadius: 0.955,                         // ignore the logo's black corners (fraction of half-width)
      lineLumMax: 120, fillLumMax: 215, satMin: 0.25, fillStepMul: 1.5, jitter: 0.3
    },
    fit: { widthRatio: 0.6, mobileWidthRatio: 0.9, maxHeightRatio: 0.7, mobileBreakpoint: 640,
           topMarginPx: 10, topInsetSelector: '#navbar' },   // shape stops under this element (if present)
    particles: { min: 1400, max: 3400, perMegaPixel: 2600, radius: [0.85, 1.35], formedGrow: 0.3,
                 ambientAlpha: [0.25, 0.55], formedAlpha: 0.95 },
    dust: { min: 40, max: 140, perMegaPixel: 90, radius: [0.5, 1.5], alpha: [0.2, 0.8], speed: [8, 26], sway: [4, 16] },
    // phase boundaries on timeline T (0..1): ASSEMBLE 0..assembleEnd, HOLD ..holdEnd, MOVE ..moveEnd, RELEASE ..1
    phases: { assembleEnd: 0.34, holdEnd: 0.46, moveEnd: 0.68 },
    assemble: { stagger: 0.5 },
    release: { stagger: 0.3, swirl: 0.25, burst: [40, 160] },
    motion: { smoothing: 4.5, maxDt: 0.05, ambientSpeed: 1, speedGain: 1.2,
              velocityGain: 0.8, velocityCap: 0.4, velocitySmoothing: 3, reducedMotionSpeed: 0.15 },
    colors: { white: '#ffffff', silver: '#aab8cc', cyan: '#22d3ee', purple: '#a78bfa', dust: '#ffffff' },
    captions: [   // fade: [startIn, fullIn, startOut, fullOut] on T
      { text: 'Scroll to assemble the signal',  size: 'sm', fade: [-0.1, -0.05, 0.16, 0.28] },
    ]
  };
  /* ------------------------------------------- */

  const section = document.getElementById('artifera-scroll');
  if (!section) return;
  const stage = section.querySelector('.afs-stage');
  const canvas = section.querySelector('.afs-canvas');
  const ctx = canvas.getContext('2d');
  const C = CONFIG, P = C.phases, TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const ease = t => t * t * t * (t * (t * 6 - 15) + 10);            // smootherstep
  const rnd = (a, b) => a + Math.random() * (b - a);
  const rr = r => rnd(r[0], r[1]);
  const PAL = [C.colors.white, C.colors.silver, C.colors.cyan, C.colors.purple];
  const CI = { white: 0, silver: 1, cyan: 2, purple: 3 };
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  section.style.height = C.section.heightVh + 'vh';

  let W = 0, H = 0, dpr = 1, cx = 0, cy0 = 0, cyTop = 0, halfH = 0, topInset = 0;
  let shape = [], dust = [], source = null;
  let ac = 0, smoothed = 0, lastRaw = 0, velS = 0, lastTs = 0, lastDrawAt = 0, rafId = 0;
  let running = false, inView = true, sampleTimer = 0, resizePending = false;
  let pointerX = -1e9, pointerY = -1e9;
  let pointerActive = false;
  function onPointerMove(event) {
    const rect = stage.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
    pointerActive = true;
  }
  function onPointerLeave() {
    pointerActive = false;
    pointerX = pointerY = -1e9;
  }
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('blur', onPointerLeave);

  /* ---------- captions ---------- */
  const caps = C.captions.map(c => {
    const el = document.createElement('div');
    el.className = 'afs-caption' + (c.size === 'lg' ? ' afs-caption--lg' : '');
    el.textContent = c.text;
    stage.appendChild(el);
    return { el, f: c.fade };
  });
  function updateCaptions(T) {
    for (const c of caps) {
      const [a, b, s, d] = c.f;
      let o = 0;
      if (T > a && T < d) o = T < b ? (T - a) / (b - a) : T <= s ? 1 : 1 - (T - s) / (d - s);
      o = ease(clamp(o));
      c.el.style.opacity = o.toFixed(3);
      c.el.style.transform = 'translate(-50%,' + ((1 - o) * 12).toFixed(1) + 'px)';
    }
  }

  /* ---------- scroll progress ---------- */
  function readProgress() {
    const range = section.offsetHeight - stage.offsetHeight;
    return range > 0 ? clamp(-section.getBoundingClientRect().top / range) : 0;
  }

  /* ---------- particle factories ---------- */
  function makeShape() {
    return { bx: Math.random() * W, by: Math.random() * H, ax: rnd(10, 30), ay: rnd(8, 36),
      fx: rnd(0.15, 0.4), fy: rnd(0.12, 0.35), px: rnd(0, TAU), py: rnd(0, TAU),
      d1: Math.random(), d2: Math.random(), r: rr(C.particles.radius), a0: rr(C.particles.ambientAlpha),
      sw: Math.random() < 0.5 ? -1 : 1, burst: rr(C.release.burst), ox: 0, oy: 0, ux: 1, uy: 0, ci: 0,
      hoverX: 0, hoverY: 0, hoverVx: 0, hoverVy: 0 };
  }
  function makeDust(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 6, r: rr(C.dust.radius), a: rr(C.dust.alpha),
      v: rr(C.dust.speed), sw: rr(C.dust.sway), f: rnd(0.2, 0.7), ph: rnd(0, TAU) };
  }

  /* ---------- source loading (image -> inline copy -> text) ---------- */
  function loadImage(src) {
    return new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  }
  async function acquireSource() {
    for (const src of [C.shape.src, C.shape.inlineFallback]) {
      if (!src || src.indexOf('__LOGO') === 0) continue;
      try {
        const img = await loadImage(src);
        const t = document.createElement('canvas'); t.width = t.height = 2;
        const g = t.getContext('2d'); g.drawImage(img, 0, 0, 2, 2); g.getImageData(0, 0, 1, 1);   // throws if tainted
        return img;
      } catch (e) { /* try next */ }
    }
    return null;
  }

  /* ---------- rasterise the shape offscreen ---------- */
  function rasterImage(side) {
    const c = document.createElement('canvas'); c.width = c.height = side;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(source, 0, 0, side, side);
    return { data: g.getImageData(0, 0, side, side).data, w: side, h: side, text: false };
  }
  function rasterText(maxW, maxH, narrow) {
    const lines = narrow ? [C.shape.fallbackLine1, C.shape.fallbackLine2] : [C.shape.fallbackText];
    const m = document.createElement('canvas').getContext('2d');
    let s = 200; m.font = C.shape.fallbackFont.replace('{s}', s);
    const adv = ln => Array.from(ln).map(ch => m.measureText(ch).width + C.shape.tracking * s);
    const wOf = ln => adv(ln).reduce((a, b) => a + b, 0) - C.shape.tracking * s;
    const widest = Math.max(...lines.map(wOf));
    s = Math.max(10, s * Math.min(maxW / widest, maxH / (lines.length * s * 1.1)));
    const c = document.createElement('canvas');
    const g = c.getContext('2d', { willReadFrequently: true });
    g.font = C.shape.fallbackFont.replace('{s}', s);
    const advS = ln => Array.from(ln).map(ch => g.measureText(ch).width + C.shape.tracking * s);
    const wS = ln => advS(ln).reduce((a, b) => a + b, 0) - C.shape.tracking * s;
    const w = Math.ceil(Math.max(...lines.map(wS))) + 4, h = Math.ceil(lines.length * s * 1.1) + 4;
    c.width = w; c.height = h;
    g.font = C.shape.fallbackFont.replace('{s}', s); g.fillStyle = '#fff'; g.textBaseline = 'middle';
    lines.forEach((ln, li) => { let x = (w - wS(ln)) / 2; const y = 2 + s * 1.1 * (li + 0.5);
      Array.from(ln).forEach((ch, k) => { g.fillText(ch, x, y); x += advS(ln)[k]; }); });
    return { data: g.getImageData(0, 0, w, h).data, w, h, text: true };
  }

  /* classify one pixel: 0 none, else (colorIndex<<2)|1 line  or |2 fill */
  function classify(R, x, y) {
    if (x < 0 || y < 0 || x >= R.w || y >= R.h) return 0;
    const i = (y * R.w + x) * 4, a = R.data[i + 3];
    if (a < 128) return 0;
    if (R.text) return (CI.white << 2) | 1;
    const dx = x + 0.5 - R.w / 2, dy = y + 0.5 - R.h / 2;
    if (Math.hypot(dx, dy) > C.shape.diskRadius * R.w / 2) return 0;
    const r = R.data[i], g = R.data[i + 1], b = R.data[i + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b, mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx ? (mx - mn) / mx : 0;
    if (sat > C.shape.satMin && lum < 200) return (((r > g + 8 && b > g + 8) ? CI.purple : CI.cyan) << 2) | 1;
    if (lum < C.shape.lineLumMax) return (CI.white << 2) | 1;
    if (lum <= C.shape.fillLumMax) return (CI.silver << 2) | 2;
    return 0;
  }
  function mulberry32(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* ---------- sample once per resize ---------- */
  function resample() {
    if (!W || !H) return;
    const narrow = W < C.fit.mobileBreakpoint;
    const maxW = W * (narrow ? C.fit.mobileWidthRatio : C.fit.widthRatio);
    const maxH = (H - topInset) * C.fit.maxHeightRatio;
    const R = source ? rasterImage(Math.max(120, Math.floor(Math.min(maxW, maxH)))) : rasterText(maxW, maxH, narrow);
    let nL = 0, nF = 0;
    for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) { const k = classify(R, x, y) & 3; if (k === 1) nL++; else if (k === 2) nF++; }
    const target = clamp(Math.round(W * H / 1e6 * C.particles.perMegaPixel), C.particles.min, C.particles.max);
    const m = C.shape.fillStepMul, rng = mulberry32(1337), pts = [];
    const stepL = Math.max(1, Math.sqrt((nL + nF / (m * m)) / target)), stepF = stepL * m, j = C.shape.jitter;
    const grid = (st, want) => {
      for (let gy = st / 2; gy < R.h; gy += st) for (let gx = st / 2; gx < R.w; gx += st) {
        const x = gx + (rng() - 0.5) * j * st, y = gy + (rng() - 0.5) * j * st;
        const code = classify(R, Math.floor(x), Math.floor(y));
        if (code && (code & 3) === want) pts.push({ x, y, ci: code >> 2 });
      }
    };
    grid(stepL, 1); grid(stepF, 2);
    if (!pts.length) return;
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of pts) { if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; }
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2; halfH = (y1 - y0) / 2;
    pts.sort((a, b) => a.ci - b.ci);                       // contiguous colours -> few fillStyle switches
    while (shape.length < pts.length) shape.push(makeShape());   // reuse existing particle objects
    shape.length = pts.length;
    pts.forEach((p, i) => {
      const s = shape[i]; s.ox = p.x - mx; s.oy = p.y - my; s.ci = p.ci;
      const a = Math.atan2(s.oy, s.ox) + (rng() - 0.5) * 1.2; s.ux = Math.cos(a); s.uy = Math.sin(a);
    });
    cyTop = Math.min(cy0, topInset + C.fit.topMarginPx + halfH);
  }

  /* ---------- layout / resize ---------- */
  function layout() {
    const nw = stage.clientWidth, nh = stage.clientHeight;
    if (!nw || !nh) return false;
    const odpr = dpr; dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (nw === W && nh === H && odpr === dpr) return false;
    const sx = W ? nw / W : 1, sy = H ? nh / H : 1;
    if (W) { for (const p of shape) { p.bx *= sx; p.by *= sy; } for (const d of dust) { d.x *= sx; d.y *= sy; } }
    W = nw; H = nh;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2; cy0 = H / 2;
    const el = C.fit.topInsetSelector && document.querySelector(C.fit.topInsetSelector);
    topInset = el ? el.getBoundingClientRect().height : 0;
    const nd = clamp(Math.round(W * H / 1e6 * C.dust.perMegaPixel), C.dust.min, C.dust.max);
    while (dust.length < nd) dust.push(makeDust(true));
    dust.length = nd;
    return true;
  }
  function onResize() {
    if (resizePending) return; resizePending = true;
    requestAnimationFrame(() => {
      resizePending = false;
      if (!layout()) return;
      clearTimeout(sampleTimer);
      sampleTimer = setTimeout(() => { resample(); renderStatic(); }, 120);
      renderStatic();
    });
  }

  /* ---------- per-frame ---------- */
  function ambient(p, out) {
    out.x = p.bx + p.ax * Math.sin(ac * p.fx + p.px);
    out.y = p.by + p.ay * Math.sin(ac * p.fy + p.py);
  }
  const A = { x: 0, y: 0 };
  function draw(T, now = performance.now()) {
    const frameScale = lastDrawAt ? clamp((now - lastDrawAt) / (1000 / 60), 0, 2) : 1;
    lastDrawAt = now;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.colors.dust;
    for (const d of dust) {
      ctx.globalAlpha = d.a; ctx.beginPath();
      ctx.arc(d.x + d.sw * Math.sin(ac * d.f + d.ph), d.y, d.r, 0, TAU); ctx.fill();
    }
    const aProg = clamp(T / P.assembleEnd);
    const mProg = ease(clamp((T - P.holdEnd) / (P.moveEnd - P.holdEnd)));
    const rProg = clamp((T - P.moveEnd) / (1 - P.moveEnd));
    const cyNow = cy0 + (cyTop - cy0) * mProg;
    const stA = C.assemble.stagger, stR = C.release.stagger, sw = C.release.swirl, grow = C.particles.formedGrow, fa = C.particles.formedAlpha;
    let lastCi = -1;
    for (const p of shape) {
      const ea = aProg >= 1 ? 1 : ease(clamp((aProg - p.d1 * stA) / (1 - stA)));
      const es = rProg <= 0 ? 0 : ease(clamp((rProg - p.d2 * stR) / (1 - stR)));
      ambient(p, A);
      const fx = cx + p.ox, fy = cyNow + p.oy, k = ea * (1 - es);
      let x = A.x + (fx - A.x) * k + p.hoverX * k;
      let y = A.y + (fy - A.y) * k + p.hoverY * k;
      if (es > 0 && es < 1) {
        const dx = A.x - fx, dy = A.y - fy, dist = Math.hypot(dx, dy) || 1, s = Math.sin(Math.PI * es), q = p.sw * sw * dist * s;
        x += (-dy / dist) * q + p.ux * p.burst * s; y += (dx / dist) * q + p.uy * p.burst * s;
      }
      if (k > 0.8) {
        p.hoverVx += -p.hoverX * 0.08 * frameScale;
        p.hoverVy += -p.hoverY * 0.08 * frameScale;
        if (pointerActive) {
          const dx = x - pointerX, dy = y - pointerY, distSq = dx * dx + dy * dy;
          const radius = 75;
          if (distSq < radius * radius && distSq > 0.1) {
            const dist = Math.sqrt(distSq);
            const force = (radius - dist) / radius * 5 * frameScale;
            p.hoverVx += (dx / dist) * force;
            p.hoverVy += (dy / dist) * force;
          }
        }
        const friction = Math.pow(0.84, frameScale);
        p.hoverVx *= friction;
        p.hoverVy *= friction;
        p.hoverX += p.hoverVx * frameScale;
        p.hoverY += p.hoverVy * frameScale;
      } else {
        p.hoverX = p.hoverY = p.hoverVx = p.hoverVy = 0;
      }
      if (p.ci !== lastCi) { ctx.fillStyle = PAL[p.ci]; lastCi = p.ci; }
      ctx.globalAlpha = p.a0 + (fa - p.a0) * k;
      ctx.beginPath(); ctx.arc(x, y, p.r * (1 + grow * k), 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  function renderStatic() { draw(smoothed, performance.now()); updateCaptions(smoothed); }

  function frame(ts) {
    rafId = 0; if (!running) return;
    const dt = lastTs ? Math.min(C.motion.maxDt, (ts - lastTs) / 1000) : 0.016; lastTs = ts;
    const raw = readProgress();
    velS += (Math.abs(raw - lastRaw) / Math.max(dt, 1e-3) - velS) * (1 - Math.exp(-C.motion.velocitySmoothing * dt));
    lastRaw = raw;
    smoothed += (raw - smoothed) * (1 - Math.exp(-C.motion.smoothing * dt));
    if (Math.abs(raw - smoothed) < 1e-5) smoothed = raw;
    const base = C.motion.ambientSpeed * (mq && mq.matches ? C.motion.reducedMotionSpeed : 1);
    const mul = base * (1 + C.motion.speedGain * smoothed + Math.min(velS * C.motion.velocityGain, C.motion.velocityCap));
    ac += dt * mul;
    for (const d of dust) {
      d.y -= d.v * mul * dt;
      if (d.y < -6) { d.y = H + 6; d.x = Math.random() * W; }
    }
    draw(smoothed, ts); updateCaptions(smoothed);
    rafId = requestAnimationFrame(frame);
  }
  function syncLoop() {
    const go = inView && !document.hidden;
    if (go && !running) { running = true; lastTs = 0; lastRaw = readProgress(); rafId = requestAnimationFrame(frame); }
    else if (!go && running) { running = false; if (rafId) cancelAnimationFrame(rafId); rafId = 0; }
  }

  /* ---------- init ---------- */
  async function init() {
    layout();
    smoothed = lastRaw = readProgress();
    renderStatic();
    source = await acquireSource();
    resample(); renderStatic();
    if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(stage);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    document.addEventListener('visibilitychange', syncLoop);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { inView = es[es.length - 1].isIntersecting; syncLoop(); }, { rootMargin: '100px 0px' }).observe(section);
    }
    syncLoop();
  }
  init();
})();
