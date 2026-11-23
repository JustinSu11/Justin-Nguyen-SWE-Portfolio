export const site = {
  name: 'Justin Nguyen',
  role: 'Software engineer',
  email: 'justin.nguyen.swe@gmail.com',
  github: { label: 'github.com/JustinSu11', href: 'https://github.com/JustinSu11' },
  linkedin: {
    label: 'linkedin.com/in/justin-nguyen-softwaredev1',
    href: 'https://www.linkedin.com/in/justin-nguyen-softwaredev1',
  },
  location: 'San Diego, CA · remote friendly',
};

export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'works', label: 'Works' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const;
